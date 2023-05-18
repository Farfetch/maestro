import { Input } from "antd";

const { Search } = Input;

const SearchBar = ({ onChangeInputText }) => (
  <Search
    placeholder="Search Run Title"
    type="text"
    onSearch={onChangeInputText}
    enterButton
    style={{
      width: 310,
      marginBottom: 15
    }}
  />
);

export default SearchBar;
