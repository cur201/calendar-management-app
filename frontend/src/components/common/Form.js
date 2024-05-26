import React from "react";
import "./Form.css";

export const FormInput = ({
  displayName,
  name,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="form-input">
      <input
        placeholder={displayName}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export class Form extends React.Component {
  constructor(props, name) {
    super(props);
    this.name = name;
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {};

  _onSubmit = (e) => {
    e.preventDefault();
    this.onSubmit(e);
  };

  render() {
    console.log(this.content)
    return (
      <div className="form-container bg-body border-light soft-shadow">
        <h1>{this.props.name}</h1>
        <div className="line-break"></div>
        <form onSubmit={this._onSubmit}>
          {this.content}
        </form>
      </div>
    );
  }
}
