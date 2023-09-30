const Filter = ({text, handleInput}) => (
    <div>
        find countries <input value={text} onChange={handleInput}/>
    </div>
)

export default Filter