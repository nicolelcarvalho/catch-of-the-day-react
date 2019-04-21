import React, { Component } from "react";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import firebase from "firebase";
import PropTypes from "prop-types"
import Login from "./Login";
import base, { firebaseApp } from "../base";

class Inventory extends Component {

	state = {
		uid: null,
		owner: null
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.authHandler({ user });
			}
		});
	};

	authHandler = async authData => {
		// Look up current store in the firebase database
		const store = await base.fetch(this.props.storeId, { context: this });
		// Claim it if there is no owner 
		if(!store.owner) {
			await base.post(`${this.props.storeId}/owner`, {
				data: authData.user.uid
			});
		}
		// Set the state of the inventory component to reflect the current user
		this.setState({
			uid: authData.user.uid,
			owner: store.owner || authData.user.uid
		})
	};

	authenticate = provider => {
		const authProvider = new firebase.auth[`${provider}AuthProvider`]();
		firebaseApp
		.auth()
		.signInWithPopup(authProvider)
		.then(this.authHandler);
	};

	logout = async () => {
		await firebase.auth().signOut();
		this.setState({ uid: null });
	};

	// Object.keys turns object into an array before mapping
	render() {

		// This can be made into a component
		const logout = <button onClick={this.logout}>Log Out</button>

		// Check if user is logged in 
		if(!this.state.uid) {
			return <Login authenticate={this.authenticate} />;
		}

		// Check if they are not the owner of the store 
		if(this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry you are not the owner!</p>
					{logout}
				</div>
			);
		}

		// They must be the owner, just render the inventory:
		return (

			<div className="inventory">

				<h2>Inventory</h2>

				{logout}

				{Object.keys(this.props.fishes).map(key => 
					<EditFishForm 
						key={key.toString()}
						index={key.toString()}
						fish={this.props.fishes[key]}
						updateFish={this.props.updateFish}
						deleteFish={this.props.deleteFish}
					/>
				)}

				<AddFishForm 
					addFish={this.props.addFish} 
					updateFish={this.props.updateFish}
				/>

				<button 
					onClick={this.props.loadSampleFishes}>
					Load Sample Fishes
				</button>

			</div>


		)
	}
}

Inventory.propTypes = {
	fishes: PropTypes.object,
	updateFish: PropTypes.func,
	deleteFish: PropTypes.func,
	loadSampleFishes: PropTypes.func
};

export default Inventory; 