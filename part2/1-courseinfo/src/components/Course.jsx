const Part = ({part}) => (
    <p>{part.name} {part.exercises}</p>
)

const Course = ({course}) => (
    <div>
        <h1>{course.name}</h1>
        {
        course.parts.map(part =>
            <Part key={part.id} part={part} />
        )
        }
        <strong><p>total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</p></strong>
    </div>
)

export default Course