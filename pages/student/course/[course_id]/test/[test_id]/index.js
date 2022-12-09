import { getSession } from 'next-auth/react';
import { courses } from "database/courses";
import { tests } from "database/tests";
import { testSubmissions } from 'database/testSubmissions';
import { shuffle } from 'helpers/functions';
export default function TestTakingPage({props}) {
    
    return (
        <>
           
        </>
    );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const course_id = context.params.course_id;
  const test_id = context.params.test_id;
  const uid = session._id;
  const course_data = await courses.getCourseById(course_id);
  const test_data = await tests.getTestById(test_id);
  if(!course_data || !test_data || test_data.course_id.toString() != course_id){
    return {
      notFound: true
    }
  }
  const studentInCourse = await courses.isStudentInCourse(course_id, uid);
  if(!studentInCourse){
    return {
        redirect: {
            destination: "/error/forbidden",
        }
    }
  }
  let questions = test_data.questions;
  let unanswered_questions = [];
  questions.forEach(question => {
    const unanswered_question = JSON.parse(JSON.stringify(question));
    //take out the correct_answers from the students
    delete unanswered_question.detail.correct_answers;
    unanswered_questions.push(unanswered_question);
  });
  unanswered_questions = shuffle(unanswered_questions);
  const testSubmission_data = await testSubmissions.createTestSubmission({
    "test_id": test_data._id,
    "unanswered_questions": shuffle(unanswered_questions)
  });
  const testSubmission_id =  testSubmission_data.insertedId.toString();
  let props = {
    course_id: course_id,
    test_id: test_id,
    testSubmission_id: testSubmission_id
  };
  return {
    props: {props}
  }
}