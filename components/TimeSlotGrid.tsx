'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'

interface TimeSlotGridProps {
  selectedDate: Date
  selectedTime: string | null
  onSlotSelect: (date: Date, time: string) => void
}

const generateTimeSlots = (configSchedule: any) => {
  const slots: string[] = [];

  const ranges = configSchedule.ranges || [
    { start: configSchedule.startTime, end: configSchedule.endTime }
  ];

  ranges.forEach((range: { start: string; end: string }) => {
    let currentTime = new Date(`1970-01-01T${range.start}:00`);
    const endTime = new Date(`1970-01-01T${range.end}:00`);

    while (currentTime < endTime) { // Changed to strict < to avoid slot AT the end time if that's intended, but usually it's inclusive of start, exclusive of end for start times?
      // Actually usually last slot starts BEFORE end time. 
      // If closes at 13:00, last slot (30m) is 12:30. 13:00 is closing.
      slots.push(currentTime.toTimeString().substring(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + configSchedule.slotDuration);
    }
  });

  return slots;
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    ))}
  </div>
);

export default function TimeSlotGrid({ selectedDate, selectedTime, onSlotSelect }: TimeSlotGridProps) {
  const [availability, setAvailability] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailability()
  }, [selectedDate])

  const fetchAvailability = async () => {
    setLoading(true)
    const availabilityMap: Record<string, number> = {}

    try {
      const dateString = selectedDate.toISOString().split('T')[0]
      const { data: blockedDate } = await supabase.from('blocked_dates').select('*').eq('blocked_date', dateString).single()
      const { data: scheduleOverride } = await supabase.from('schedule_overrides').select('*').eq('override_date', dateString).single()

      let slotsForDay: string[] = [];

      if (scheduleOverride && !scheduleOverride.is_closed) {
        // Override uses strict start/end
        // We can adapt generateTimeSlots to accept a temp config-like object
        slotsForDay = generateTimeSlots({
          ranges: [{ start: scheduleOverride.start_time, end: scheduleOverride.end_time }],
          slotDuration: config.schedule.slotDuration
        });
      } else {
        slotsForDay = generateTimeSlots(config.schedule);
      }

      setTimeSlots(slotsForDay);

      if (blockedDate || (scheduleOverride && scheduleOverride.is_closed)) {
        slotsForDay.forEach(time => availabilityMap[time] = 100) // Blocked
        setAvailability(availabilityMap)
        return
      }

      const { data: barbers } = await supabase.from('barbers').select('id');
      const barberCount = barbers?.length || 1;

      for (const time of slotsForDay) {
        const [hours, minutes] = time.split(':').map(Number)
        const slotDate = new Date(selectedDate)
        slotDate.setHours(hours, minutes, 0, 0)

        const { count, error } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('service_type', 'corte').gte('appointment_date', slotDate.toISOString()).lt('appointment_date', new Date(slotDate.getTime() + config.schedule.slotDuration * 60000).toISOString())
        if (error) throw error
        availabilityMap[time] = count || 0
      }
      setAvailability(availabilityMap)
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const isPastTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const slotDateTime = new Date(selectedDate)
    slotDateTime.setHours(hours, minutes, 0, 0)
    return slotDateTime < new Date()
  }

  const barberCount = 2; // Asumiendo 2 barberos por ahora

  if (loading) return <SkeletonLoader />;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {timeSlots.map((time) => {
        const count = availability[time] || 0;
        const isFull = count >= barberCount;
        const isPast = isPastTime(time);
        const isSelected = selectedTime === time;
        const isDisabled = isFull || isPast;

        return (
          <button
            key={time}
            onClick={() => !isDisabled && onSlotSelect(selectedDate, time)}
            disabled={isDisabled}
            className={`
              w-full text-center px-1 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative overflow-hidden group
              ${isSelected
                ? 'bg-gold-500 text-black shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)] scale-105 font-bold z-10'
                : isDisabled
                  ? 'bg-zinc-900/50 text-zinc-600 cursor-not-allowed border border-transparent'
                  : 'bg-zinc-800/50 text-zinc-300 border border-white/5 hover:border-gold-500/50 hover:text-white hover:bg-zinc-800'
              }
            `}
          >
            <span className="relative z-10">{time}</span>
            {/* Optional: Add a subtle indicator for remaining slots if not full */}
            {!isDisabled && !isSelected && count > 0 && (
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-gold-500/50"></span>
            )}
          </button>
        )
      })}
    </div>
  )
}
