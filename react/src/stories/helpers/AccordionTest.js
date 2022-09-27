import React, { Component } from 'react';
import Accordion from 'components/Layout/Accordion';

class AccordionTest extends Component {
	state = {
		open: false
	}

	render() {
		const { open } = this.state;

		return (
			<Accordion open={open}>
				<Accordion.Header open={open} onOpen={() => this.setState({ open: true })} onClose={() => this.setState({ open: false })}>
					Accordion header
				</Accordion.Header>

				<Accordion.Body open={open}>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consectetur vehicula odio, ut venenatis arcu tristique nec. Quisque ligula erat, dapibus et lorem vitae, mollis sollicitudin metus. Proin molestie magna at risus vulputate rhoncus. Fusce sit amet augue nisl. Nulla luctus erat finibus, faucibus ante id, euismod ex. Curabitur quis varius odio. Donec fermentum arcu lorem, quis maximus erat cursus non. Nullam ullamcorper commodo felis, sed ullamcorper augue sollicitudin sit amet. Nam suscipit vulputate vestibulum. Suspendisse varius a dolor semper volutpat.</p>
					<p>Duis viverra dignissim placerat. Nunc quis fringilla purus, et dictum justo. Fusce venenatis erat id vehicula molestie. Nunc sed elementum mauris, eget blandit leo. Vivamus in tortor accumsan risus placerat faucibus sed a tortor. Nulla sit amet pretium nunc. Donec pretium quis nisi id facilisis. Vestibulum non mauris ultricies, interdum sem in, porttitor enim. Aenean et ultricies nisi. Suspendisse potenti. Ut augue felis, congue non venenatis vitae, varius ut sapien. Cras facilisis mi vitae arcu ullamcorper, ut faucibus orci mollis. Aliquam ac pretium leo. Nam in nisi elit. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
				</Accordion.Body>
			</Accordion>
		);
	}
}

export default AccordionTest;