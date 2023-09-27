const Header = (prop) => {
  console.log('Header : %o', prop)
  return (
    <>
      <h1>{prop.course}</h1>
    </>
  )
}

const Part = (prop) => {
  console.log('Part : %o', prop)
  return (
    <>
      <p>
        {prop.part.name} {prop.part.exercises}
      </p>
    </>
  )
}

const Content = (prop) => {
  console.log('Content : %o', prop)
  return (
    <>
      <Part part={prop.parts[0]} />
      <Part part={prop.parts[1]} />
      <Part part={prop.parts[2]} />
    </>
  )
}

const Total = (prop) => {
  console.log('Total : %o', prop)
  let total = 0
  prop.parts.forEach(part => total += part.exercises)
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

export default App