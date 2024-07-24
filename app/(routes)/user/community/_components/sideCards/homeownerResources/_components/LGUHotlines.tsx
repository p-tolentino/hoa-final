'use client'
import { Button } from '@chakra-ui/react'

const lguHotlinesUrl =
  'https://e911.gov.ph/emergency-hotline-numbers/?fbclid=IwAR3_6GmuGmMIWISf76oelH2HqzvgqmEkQVgWNzsJQqZadyVsEykGBfd12WM'
function LGUHotlines () {
  const handleButtonClick = () => {
    window.open(lguHotlinesUrl, '_blank') // Open in a new tab
  }

  return (
    <div>
      <Button
        variant='link'
        fontFamily='font.body'
        fontWeight='light'
        onClick={handleButtonClick} // Call the function on click
        key='LGUHotlines'
        color='black'
        size='sm'
      >
        Emergency Hotline Numbers
      </Button>
    </div>
  )
}

export default LGUHotlines
