'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'

interface TimeSlotGridProps {
  selectedDate: Date
  selectedTime: string | null
  onSlotSelect: (date: Date, time: string) => void
}

const generateTimeSlots = (start: string, end: string, duration: number) => {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (currentTime <= endTime) {
    slots.push(currentTime.toTimeString().substring(0, 5));
    currentTime.setMinutes(currentTime.getMinutes() + duration);
  }
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

      let slotsForDay = generateTimeSlots(config.schedule.startTime, config.schedule.endTime, config.schedule.slotDuration);
      if (scheduleOverride && !scheduleOverride.is_closed) {
        slotsForDay = generateTimeSlots(scheduleOverride.start_time, scheduleOverride.end_time, config.schedule.slotDuration)
      }
      setTimeSlots(slotsForDay);

      if (blockedDate || (scheduleOverride && scheduleOverride.is_closed)) {
        slotsForDay.forEach(time => availabilityMap[time] = 2) // Assume 2 barbers max
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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
            className={`w-full text-center px-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
              ${isSelected
                ? 'bg-yellow-400 text-zinc-900 shadow-md ring-2 ring-yellow-500/50'
                : isDisabled
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 line-through cursor-not-allowed'
                : 'bg-white dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:border-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 dark:hover:border-yellow-500'
              }
            `}
          >
            {time}
          </button>
        )
      })}
    </div>
  )
}
