const Person = ({ newName, updateName, tel, updateTel, handleSubmitNewName }) => {

    return (
        <form>
            <div>debug: {newName}</div>
            <label>Name: </label> <input type="text" value={newName} onChange={updateName} />
            <br></br>
            <label>Tel:     </label><input type="text" value={tel} onChange={updateTel} />
            <div>
                <button type="submit" onClick={handleSubmitNewName}>add</button>
            </div>
        </form>
    )
}

export default Person