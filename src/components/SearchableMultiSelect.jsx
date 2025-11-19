import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#374151', // bg-gray-700
    borderColor: state.isFocused ? '#6366f1' : '#4b5563', // focus:ring-indigo-500, border-gray-600
    boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
    '&:hover': {
      borderColor: '#6b7280', // hover:border-gray-500
    },
    minHeight: '42px',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1f2937', // bg-gray-800
    zIndex: 20,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#374151' : '#1f2937', // selected:bg-indigo-600, focused:bg-gray-700, default:bg-gray-800
    color: '#e5e7eb', // text-gray-200
    '&:active': {
      backgroundColor: '#4338ca', // active:bg-indigo-700
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#4f46e5', // bg-indigo-600
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#e5e7eb',
    ':hover': {
      backgroundColor: '#4338ca', // hover:bg-indigo-700
      color: 'white',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: '#e5e7eb', // text-gray-200
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af', // text-gray-400
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#e5e7eb', // text-gray-200
  }),
};

const SearchableMultiSelect = ({ options, value, onChange, isDisabled = false, placeholder = "Select..." }) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      styles={customStyles}
      isDisabled={isDisabled}
      placeholder={placeholder}
    />
  );
};

export default SearchableMultiSelect;