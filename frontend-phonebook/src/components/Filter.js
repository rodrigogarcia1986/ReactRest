const Filter = ({ find, updateFind, handleSearch }) => {
    return (
        <form>
            <label>Search:</label><input type="text" value={find} onChange={updateFind} />
            <button type="submit" onClick={handleSearch}>search!</button>
        </form>
    )
}

export default Filter;