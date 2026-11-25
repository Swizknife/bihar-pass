import { QueryFeedback } from '../components/QueryFeedback'
import { CenterTitle } from './ExperiencePages'

export function ContactPage() {
  return (
    <>
      <CenterTitle title="Queries and Feedback" tagline="We would like to hear from you" crumbs={[{ label: 'Home', to: '/' }, { label: 'Queries and Feedback' }]} />
      <QueryFeedback heading={false} />
    </>
  )
}
