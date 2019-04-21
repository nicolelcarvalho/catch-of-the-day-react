import React, { Component } from "react";
import Header from "./Header";
import Inventory from "./Inventory";
import Order from "./Order";
import sampleFishes from "../sample-fishes.js";
import Fish from "./Fish";
import base from "../base";
import PropTypes from "prop-types";

class App extends Component {

	state = {
		fishes: {},
		order: {}
	};

	componentDidMount() {
		const { params } = this.props.match;
		// first reinstate our localStorage
		const localStorageRef = localStorage.getItem(`${params.storeId}`);

		if(localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}

		this.ref = base.syncState(`${params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentDidUpdate() {
		// this.props.match comes from router that's available to us (click on App in React console)
		const { params } = this.props.match;
		localStorage.setItem(
			`${params.storeId}`,
			JSON.stringify(this.state.order)
		);
	}

	addFish = fish => {
		const fishes = {...this.state.fishes}

		fishes[`fish${Date.now()}`] = fish;

		// this is the same thing as this.setState({ fishes });
		this.setState({
			fishes: fishes
		});
	};

	updateFish = (key, updatedFish) => {
		// Take a copy of the current state
		const fishes = { ...this.state.fishes };
		// Update that state 
		fishes[key] = updatedFish;
		// Set that to state
		this.setState({ fishes });
	};

	deleteFish = key => {
		const fishes = { ...this.state.fishes };
		// Since Firebase holds the fishes from each store,
		// this step is required because we want Firebase to delete it as well. 
		fishes[key] = null;
		this.setState({ fishes });
	};

	loadSampleFishes = () => {
		this.setState({ fishes: sampleFishes });
	};

	addToOrder = key => {
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	};
 
 	removeFromOrder = key => {
		// Take a copy of the current state
		const order = { ...this.state.order };
		// Delete from order 
		delete order[key];
		// Set that to state
		this.setState({ order });
	};

	render() {
		return (

			<div className="catch-of-the-day">

				<div className="menu">

					<Header tagline="Fresh Seafood Market" />

					<ul className="fishes">
						{ Object.keys(this.state.fishes).map( key => 
							<Fish 
								key={key} 
								index={key} 
								details={this.state.fishes[key]} 
								addToOrder={this.addToOrder}
							/>
						)}
					</ul>

				</div>

				<Order 
					fishes={this.state.fishes}
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
				/>

				<Inventory 
					addFish={this.addFish} 
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					loadSampleFishes={this.loadSampleFishes} 
					fishes={this.state.fishes}
					storeId={this.props.match.params.storeId}
				/>

			</div>

		)
	}


}

App.propTypes = {
	match: PropTypes.object
};

export default App;