import { Input } from "antd";

const { Search } = Input;

const SearchBar = ({ onChangeSearchRunTitle, placeholder }) => (
  <Search
    placeholder={placeholder}
    type="text"
    onSearch={onChangeSearchRunTitle}
    enterButton
    style={{
      width: 310,
      marginBottom: 15
    }}
  />
);

export default SearchBar;
