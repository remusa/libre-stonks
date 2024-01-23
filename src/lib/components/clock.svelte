<script>
  import { onDestroy, onMount } from 'svelte'

  let currentHour = ''
  let currentMinute = ''
  let currentSecond = ''
  let period = ''

  function updateClock() {
    const now = new Date()
    const hours = now.getHours() % 12 || 12 // Convert 24-hour time to 12-hour time
    currentHour = hours.toString().padStart(2, '0')
    currentMinute = now.getMinutes().toString().padStart(2, '0')
    currentSecond = now.getSeconds().toString().padStart(2, '0')
    period = now.getHours() >= 12 ? 'PM' : 'AM'
  }

  onMount(() => {
    // Set up the interval to update the clock every second
    const interval = setInterval(updateClock, 1000)

    // Initial call to set the clock immediately
    updateClock()

    // Cleanup on component destroy
    return () => {
      clearInterval(interval)
    }
  })
</script>

<div>
  <p>{currentHour}:{currentMinute}:{currentSecond} {period}</p>
</div>
