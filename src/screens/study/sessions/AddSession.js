const AddSession = ({ navigation, route }) => {
  const {planId}=route.params
  console.log(planId)
  return <></>;
};
export default AddSession;
/* const session = {
   title: string, // title like "Section 1: Introduction"
   description: string, // session-specific goals and topics
   notes: string, // optional notes section
   tags: array, // array of tags for organization like "reading", "review"
   timer: {
       duration: number, // session duration in minutes for Pomodoro
       intervalCount: number, // number of intervals per session
       completedIntervals: number, // intervals completed
   },
   attachments: array, // links or file paths for resources like images, PDFs, etc.
   completed: bool, // marks if the session is completed
}; */
