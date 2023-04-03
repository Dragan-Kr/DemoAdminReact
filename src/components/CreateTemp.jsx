// import React, { Component } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
// import CompanyService from '../services/CompanyService';

// class CreateCompanyComponent extends Component {

//     constructor(props){
//         super(props)
//         this.state ={
//             id:'',
//             tel: '',
//             tin: '',
//             name: '',
//             address:'',
//             city: '',
//             country: '',
//             indetNum: '',
//             activityNum:'',
//             per_id:''
//         }
//         this.changeTelHandler = this.changeTelHandler.bind(this);
//         this.changeTINHandler = this.changeTINHandler.bind(this);
//         this.changeNameHandler = this.changeNameHandler.bind(this);
//         this.changeAddressHandler = this.changeAddressHandler.bind(this);
//         this.changeCityHandler =this.changeCityHandler.bind(this);
//         this.changeCountryHandler = this.changeCountryHandler.bind(this);
//         this.changeIndetNumHandler = this.changeIndetNumHandler.bind(this); 
//         this.changeActivityNumHandler = this.changeActivityNumHandler.bind(this);
//     }

//     saveCompany =(e)=>{
//         e.preventDefault();
//         let company = {tel:this.state.tel, tin:this.state.tin, name:this.state.name, address:this.state.address, city:this.state.city,
//         country:this.state.country, indetNum:this.state.indetNum,activityNum:this.state.activityNum, per_id:this.state.per_id}
//         console.log("company=>" +JSON.stringify(company));
//         console.log("Id company=>" + this.state.id);


//         CompanyService.createCompany(company).then(res=>{
//             this.props.history.push('/company');
                
//         }).catch((error)=>{
//             console.log(error.message);
//         });
//     }

//     cancel(){
//         this.props.history.push('/company');
//     }


//     changeTelHandler =(event)=>{
//         this.setState({tel:event.target.value});
//     }

    
//     changeTINHandler =(event)=>{
//         this.setState({tin:event.target.value});
//     }

    
//     changeNameHandler =(event)=>{
//         this.setState({name:event.target.value});
//     }

//     changeAddressHandler =(event)=>{
//         this.setState({address:event.target.value});
//     }

//     changeCityHandler =(event)=>{
//         this.setState({city:event.target.value});
//     }

//     changeCountryHandler =(event)=>{
//         this.setState({country:event.target.value});
//     }

//     changeIndetNumHandler =(event)=>{
//         this.setState({indetNum:event.target.value});
//     }

//     changeActivityNumHandler = (event)=>{
//         this.setState({activityNum:event.target.value});
//     }








//     render() {
//         return (
//             <div>
//                <div className="container">
//                        <div className="row">
//                             <div className="card col-md-6 offset-md-3 offset-md-3">
//                                 <h3 className="text-center">Add Company</h3>
//                                     <div className="card-body">
//                                          <form>
//                                              <div className="form-group">
//                                                  <label>Tel</label>
//                                                  <input placeholder="Tel" name="tel" className="form-control"
//                                                  value1={this.state.tel} onChange={this.changeTelHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>TIN</label>
//                                                  <input placeholder="TIN" name="tin" className="form-control"
//                                                  value2={this.state.tin} onChange={this.changeTINHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>Name</label>
//                                                  <input placeholder="Name" name="name" className="form-control"
//                                                  value3={this.state.name} onChange={this.changeNameHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>Address</label>
//                                                  <input placeholder="Address" name="address" className="form-control"
//                                                  value4={this.state.address} onChange={this.changeAddressHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>City</label>
//                                                  <input placeholder="City" name="city" className="form-control"
//                                                  value5={this.state.city} onChange={this.changeCityHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>Country</label>
//                                                  <input placeholder="Country" name="country" className="form-control"
//                                                  value6={this.state.country} onChange={this.changeCountryHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>Indet Number</label>
//                                                  <input placeholder="IndetNum" name="indetNum" className="form-control"
//                                                  value7={this.state.indetNum} onChange={this.changeIndetNumHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>Activity Number</label>
//                                                  <input placeholder="ActivityNum" name="activityNum" className="form-control"
//                                                  value8={this.state.activityNum} onChange={this.changeActivityNumHandler}/>
//                                              </div>

//                                              <div>
//                                              <label>Your name</label>
//                                                 <Select options={this.state.selectPersons} value9={this.state.per_id}  onChange={this.handlePersonChange.bind(this)} />
//                                             </div>



//                                              <button className="btn btn-success" onClick={this.saveCompany}>Save</button>
//                                             <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Cancel</button>

//                                          </form>
//                                     </div>

//                             </div>
//                        </div>
//                   </div>
//             </div>
//         );
    
// }

//  //mozda ovde
//  async getListOfPersons(){
//     const res = await axios.get('http://localhost:8080/person')
//     const data = res.data

//     const persons = data.map(d => ({
//       "value" : d.id,
//       "label" : d.name + ' ' +d.surname
//     }))
//     this.setState({selectPersons: persons})
//   }

//   componentDidMount(){
//     this.getListOfPersons();
    
// }

// handlePersonChange(e){
//     this.setState({per_id:e.value, name:e.label})
//    }

// }
// export default CreateCompanyComponent;