import React, { Component, Fragment } from 'react';
//  ^ Imported libraries, etc | V my own components
import Modal from '../../components/UI/Modal/Modal'
//  This component recieves whatever component it's wrapped around during export, as well
//  as passing axios (or whatever instance of axios said component utilizes) for use here.
//  Also, this higher order component must extend component so that we can use life cycle
//  hooks.  
const withErrorHandler = (WrappedComponent, axios ) => {
//  Notice I don't say return class NameOfClass extends Component.  This is because this
//  returned class is never exported like the withErrorHandler class.  It is simply a 
//  component factory.
    return class extends Component {
        state = {
            error: null
        }
//  We use WillMount rather than DidMount because we're actually getting the requests and 
//  responses in wrapped components during their DidMount cycle, and so this makes sure 
//  interceptors can happen in time.
        componentWillMount () {  
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
//  I'm interrupting the request, but returning it at the end so it is passed on to whatever
//  calls for it down the line.
                return req;
            })
//  This interrupts the response, returns it if there's no error, and in the case that there
//  is, it catches it by setting the error prop of state to the returned error.  This prints
//  on the modal below.
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }
//  The below method just handles clicks to the modal background by resetting the error prop
//  of state.  
        errorConfirmedHandler =()=> {
            this.setState({error:null})
        }
//  We want to eject our interceptors made in this higher order component because if we don't
//  and wrap multiple components in this component, old interceptors will sit in memory best 
//  case, and cause bugs in worst case.  As a component unmounts, eject() is called.
        componentWillUnmount () {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        render() {
            return (
                <Fragment>
                    <Modal 
                        modalClosed={this.errorConfirmedHandler}
                        show={this.state.error}
                    >
                        {this.state.error? this.state.error.message : null}
                </Modal>
{/* I want to use the spread operator to populate the area inside the curly braces with the 
    relevant props the wrapped container passes without knowing what they are.*/}
                    <WrappedComponent {...this.props} />
                </Fragment>
            );
        }
    }
}

export default withErrorHandler;