import { Input } from "antd";

const { Search } = Input;

const SearchBar = ({ onChangeSearchRunTitle }) => (
  <Search
    placeholder="Search Run Title"
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
