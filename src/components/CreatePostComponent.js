// import React, { Component } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
// import PostService from '../services/PostService';
// import MultipleSelection from './MultipleSelection';
// import SwitchBooleanComponent from '../components/SwitchBooleanComponenet';

// class CreatePostComponent extends Component{
//   constructor(props){
//    super(props);

//    this.state={
//      _id:'',
//       title:'',
//       shortDescription:'',
//       mainContent:'',
//       isPublished:'',
//       postDate:'',
//       createdBy:[]
//    };

//    this.changeTitleHandler=this.changeTitleHandler.bind(this);
//    this.changeTitleHandler = this.changeTitleHandler.bind(this);
//    this.changeShortDescriptionHandler =  this.changeShortDescriptionHandler.bind(this);
//    this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
//    this.changeIsPublishedHandler =  this.changeIsPublishedHandler.bind(this);
//    this.changePostDateHandler =  this.changePostDateHandler.bind(this);
//    this.savePost = this.savePost.bind(this);
//   }

//   savePost(e){
//     e.preventDefault();
//     let post = {title:this.state.title,shortDescription:this.state.shortDescription,mainContent:this.state.mainContent,
//         isPublished:this.state.isPublished,postDate:this.state.postDate,createdBy:this.state.createdBy
//     };

//     PostService.createPost(post);
//     // .then(res=>{
//       //  this.props.history.push('/post');
//     // }).catch((error)=>{
//     //         console.log(error.message);
//     //     });

//   }

//   changeTitleHandler (event){
//     this.setState({title:event.target.value});
// }

// changeShortDescriptionHandler(event){
//     this.setState({shortDescription:event.target.value});
// }

// changeMainContentHandler(event){
// this.setState({mainContent:event.target.value});
// }

// changeIsPublishedHandler(event){
//     this.setState({isPublished:event.target.value});
// }


// changePostDateHandler(event){
//     this.setState({postDate:event.target.value});
// }

// // cancel(){
// //     this.props.history.push('/post');
// // }

// render(){
//     const inputStyle={
//         width: "100%",
//         padding: "12px 20px",
//         margin: "8px 0",
//         display: "inline-block",
//         border: "1px solid #ccc",
//         borderRadius: "4px",
//         boxSizing: "border-box",
//     };


//    const buttonStyle={
//     width: "100%",
//   backgroundColor: "#4CAF50",
//   color: "white",
//   padding: "14px 20px",
//   margin: "8px 0",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer"
//    };



//   return(
//     <div
//     style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100%"
//     }}
//   >
//                <div className="container">
//                        <div className="row">
//                             <div className="card col-md-6 offset-md-3 offset-md-3">
//                                 <h3 className="text-center">Add New Post</h3>
//                                     <div className="card-body">
//                                          <form>
//                                              <div className="form-group">
//                                                  <label className='from-label'>Title</label>
//                                                  <input style={inputStyle} placeholder="Title" name="title" className="form-control"
//                                                  value1={this.state.title} onChange={this.changeTitleHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>ShortDescription</label>
//                                                  <textarea style={inputStyle} placeholder="ShortDescription" name="shortDescription" className="form-control"
//                                                  value2={this.state.shortDescription} onChange={this.changeShortDescriptionHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  <label>Main Content</label>
//                                                  <textarea style={inputStyle} placeholder="MainContent" name="mainContent" className="form-control"
//                                                  value3={this.state.mainContent} onChange={this.changeMainContentHandler}/>
//                                              </div>

//                                              <div className="form-group">
//                                                  {/* <label>isPublished</label> */}
//                                                  {/* <input style={inputStyle} placeholder="isPublished" name="isPublished" className="form-control"
//                                                  value4={this.state.isPublished} onChange={this.changeIsPublishedHandler}/> */}
//                                                  <SwitchBooleanComponent/>
//                                              </div>


//                                              <div className="form-group">
//                                                  <label>Post Date</label>
//                                                  <input style={inputStyle} placeholder="PostDate" name="postDate" className="form-control"
//                                                  value6={this.state.postDate} onChange={this.changePostDateHandler}/>
//                                              </div>



//                                              <div>
//                                              <label>Your name</label>
//                                                 <Select className='form-select' options={this.state.createdBy} value9={this.state.createdBy}  onChange={this.handleWriterChange.bind(this)} />
//                                             </div>

//                                              <div className="form-group">
//                                              <label>Your name-Static</label>
//                                                 <MultipleSelection/>
//                                             </div>   


//                                              <button style={buttonStyle} className="btn btn-success" onClick={this.savePost}>Save</button>
//                                             {/* <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Cancel</button> */}

//                                          </form>
//                                     </div>

//                             </div>
//                        </div>
//                   </div>
//             </div>
//   );


// }

// async getListOfWriters(){
//     const res = await axios.get('http://localhost:8000/api/writer');
// console.log('res',res);
//     //const outputArr = inputObj.writers.map(writer => writer);
//     const writers = res.data.writers.map(d => ({
//       "value" : d._id,
//       "label" : d.name + ' ' +d.lastName
//     }))
//     this.setState({createdBy: writers})
//     console.log('selectWriters su:' + JSON.stringify(writers));
//   }

//   componentDidMount(){
//     this.getListOfWriters();

// }

// handleWriterChange(e){
//     this.setState({createdBy:e.value, name:e.label})
//    }



// }export default CreatePostComponent;





import React from "react";
import Select from 'react-select';
import SwitchBooleanComponent from '../components/SwitchBooleanComponenet';
import MultipleSelection from './MultipleSelection';




const dropdownIndicatorStyles = (base, state) => {
    let changes = {
        // all your override styles
        backgroundColor: "green"
    };
    return Object.assign(base, changes);
};


const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: ' #F4F5FC', borderRadius: 15, height: 50, border: 0, dropdownIndicator: { dropdownIndicatorStyles } }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return (
            {
                ...styles,
                backgroundColor: '#F4F5FC',
                color: '#6D7587',
                
                dropdownIndicator: { dropdownIndicatorStyles }
            }
        );
    },


};


const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
];





function CreatePostComponent() {
    return (
        <form>
            <div className="d-flex flex-row">

                <div className="left-form">
                    <input className="title-input" placeholder="Title" type='text' />
                    <h2>Content</h2>
                    <div className="textarea-content">
                        <label>Short description</label>
                        <textarea rows="5" cols="50" placeholder="Short content of the editor...">
                        </textarea>
                    </div>

                    <div className="textarea-content">
                        <label>Main content</label>

                        <textarea rows="20" cols="50" placeholder="Content of the editor...">
                        </textarea>
                    </div>



                </div>

                <div className="right-form">

                    <div className="select-content">
                        <label>Written By</label>
                        <Select
                            //  defaultValue={items[0]}
                            //label="Single select"
                            options={options}
                            styles={colourStyles} />
                    </div>

                    <div className="date-content">
                        <label>Post Date</label>
                        <input className="date-input" placeholder="5 May 2022" type='text' />
                    </div>




                    <div className="categories-content">
                        <label>Categories</label>
                        <MultipleSelection />
                    </div>

                    <div className="published-content">
                        <label>Published</label>
                        {/* <SwitchBooleanComponent /> */}
                        <label class="switch">
                            <input type="checkbox" style={{backgroundColor:"red"}} />
                            <span class="slider round"></span>
                        </label>

                    </div>


                </div>
            </div>
        </form>



    )



}

export default CreatePostComponent;