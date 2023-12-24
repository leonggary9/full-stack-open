import { CoursePart } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({coursePart}: {coursePart: CoursePart}) => {
  switch (coursePart.kind) {
    case "basic":
      return <p> 
        <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
        <i>{coursePart.description}</i>
      </p>
    case "group":
      return <p> 
        <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
        {'project exercises ' + coursePart.groupProjectCount}
      </p>
    case "background":
      return <p> 
        <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
        <i>{coursePart.description}</i><br/>
        {'submit to ' + coursePart.backgroundMaterial}
      </p>
    case "special":
      return <p> 
        <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
        <i>{coursePart.description}</i><br/>
        {'required skills: ' + coursePart.requirements}
      </p>
    default:
      return assertNever(coursePart)
  }
}

export default Part;