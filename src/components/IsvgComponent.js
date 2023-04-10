import Isvg from 'react-inlinesvg';



function IsvgComponent (props){

return(

<span className='name-arrows'>
 {props.name}   
<Isvg src={props.image}/>
</span>

);




};

export default IsvgComponent;