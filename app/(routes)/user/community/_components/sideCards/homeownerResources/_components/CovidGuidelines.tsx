'use client'
import { Button } from '@chakra-ui/react'

const covidGuidelinesUrl =
  'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public?adgroupsurvey={adgroupsurvey}&gad_source=1&gclid=Cj0KCQiA84CvBhCaARIsAMkAvkI0OsE7gIAq0G8gxG5R4pQzDmNIwRWiFglSKloyDDEpBO-JubvirI0aAjyBEALw_wcB'

function CovidGuidelines () {
  const handleButtonClick = () => {
    window.open(covidGuidelinesUrl, '_blank') // Open in a new tab
  }

  return (
    <div>
      <Button
        variant='link'
        fontFamily='font.body'
        fontWeight='light'
        onClick={handleButtonClick} // Call the function on click
        key='CovidGuidelines'
        color='black'
        size='sm'
      >
        COVID-19 Guidelines
      </Button>
    </div>
  )
}

export default CovidGuidelines
