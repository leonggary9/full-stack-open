import { CoursePart } from "../types";
import Part from "./Part";

const Content = ({courseParts}: {courseParts: CoursePart[]}) => {
  return <div>
    {
      courseParts.map(c => <Part coursePart={c} />)
    }
  </div>
}

export default Content;