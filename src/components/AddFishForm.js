import React, { Component } from "react";
import PropTypes from "prop-types";

class AddFishForm extends Component {
	nameRef = React.createRef();
	priceRef = React.createRef();
	statusRef = React.createRef();
	descRef = React.createRef();
	imageRef = React.createRef();

	createFish = event => {
		event.preventDefault();

		const fish = {
			name: this.nameRef.current.value,
			price: parseFloat(this.priceRef.current.value), // stores it as cents
			status: this.statusRef.current.value,
			desc: this.descRef.current.value,
			image: this.imageRef.current.value
		}

		this.props.addFish(fish);

		// refreshes the form 
		event.currentTarget.reset();
	}


	render() {
		return (

			<form className="fish-edit" onSubmit={this.createFish}>

				<input name="name" ref={this.nameRef} type="text" placeholder="Name" />

				<input name="price" ref={this.priceRef}mtype="text" placeholder="Price" />

				<select name="status" ref={this.statusRef}>

					<option value="available">Fresh!</option>

					<option value="unavailable">Sold Out!</option>

				</select>

				<textarea name="desc" ref={this.descRef} placeholder="Desc" />

				<input name="image" ref={this.imageRef} type="text" placeholder="Image" />

				<button type="submit">+ Add Fish</button>

			</form>


		)
	}
}

AddFishForm.propTypes = {
	addFish: PropTypes.func
};

export default AddFishForm; 