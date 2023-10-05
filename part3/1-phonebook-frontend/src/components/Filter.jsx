const Filter = ({text, handleInput}) => (
    <div>
        filter shown with <input value={text} onChange={handleInput}/>
    </div>
)

export default Filter