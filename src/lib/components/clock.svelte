<script>
import { useInterval } from '$lib/use-interval'

let currentHour = $state('')
let currentMinute = $state('')
let currentSecond = $state('')
let period = $state('')

function updateClock() {
	const now = new Date()
	const hours = now.getHours() % 12 || 12 // Convert 24-hour time to 12-hour time
	currentHour = hours.toString().padStart(2, '0')
	currentMinute = now.getMinutes().toString().padStart(2, '0')
	currentSecond = now.getSeconds().toString().padStart(2, '0')
	period = now.getHours() >= 12 ? 'PM' : 'AM'
}

useInterval(updateClock, 1000)
</script>

<div>
  <p>{currentHour}:{currentMinute}:{currentSecond} {period}</p>
</div>
