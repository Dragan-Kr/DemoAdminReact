import React from "react";
import { useParams } from "react-router-dom";
import UpdatePostComponent from "./UpdatePostComponent";


const UpdatePost = (props) => {
  let { id } = useParams();

  // let [isNewPostAdd,setIsNewPostAdd] = useState(true)
  // let [preselectedCategories, setPreselectedCategories] = useState([]);
  // let [preselectedCategoriesArray, setPreselectedCategoriesArray] = useState(
  //   []
  // );

  // useEffect(()=>{
  // let res=[];

  //   const fetchData = async () => {
  //     try {
  //       res = await axios.get(`${POST_API}/${id}`);
  //       // console.log("UpdatePost->res.data.post.categories",res.data.post.categories)
  //       setPreselectedCategories(res.data.post.categories);
  //       console.log("UpdatePost->odmah nakon setovanje->setPreselectedCategories",preselectedCategories)
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();

  //   console.log("UpdatePost->preselectedCategories odmah nakon pozivanja fetchData",preselectedCategories)

  //   for (let index in preselectedCategories) {

  //     if (
  //       typeof index === "undefined" ||
  //       index < 0 ||
  //       index >= preselectedCategories.length
  //     ) {
  //       console.log("Invalid index value:", index);
  //       return;
  //     }

  //      axios.get(CATEGORY_API + "/" + this.state.preselectedCategories[index])
  //       .then((res) => {
  //         // console.log("getListOfPreselectedCategories=>res.data", res.data);
  //         // preselectedCategoriesArray.push(res.data.category);

  //         setPreselectedCategoriesArray((prevArray) => [...prevArray, res.data.category]);

  //         const preselectedCategoriesArray2 = preselectedCategoriesArray.map(
  //           (d) => ({
  //             value: d._id,
  //             label: d.name,
  //           })
  //         );
  //         setPreselectedCategoriesArray(preselectedCategoriesArray2)

  //       })
  //       .catch(function (error) {
  //         console.log("Error in fetching data");
  //       });
  //   }
  // },[]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if(id){ 
  //         console.log("UpdatePost->ima id",id)
  //       let res = await axios.get(`${POST_API}/${id}`);
  //       setPreselectedCategories(res.data.post.categories);
  //       console.log(
  //         "UpdatePost -> setPreselectedCategories",
  //         preselectedCategories
  //       );

  //       const promises = preselectedCategories.map((categoryId) =>
  //         axios
  //           .get(`${CATEGORY_API}/${categoryId}`)
  //           .then((res) => res.data.category)
  //       );

  //       const categoriesData = await Promise.all(promises);
  //       const preselectedCategoriesArray = categoriesData.map((category) => ({
  //         value: category._id,
  //         label: category.name,
  //       }));

  //       setPreselectedCategoriesArray(preselectedCategoriesArray);
  //       console.log(
  //         "UpdatePost -> setPreselectedCategoriesArray",
  //         preselectedCategoriesArray
  //       );
  //     }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   // fetchData();
  // }, []);

  if (id !== undefined) {
    console.log("ima id");
    return (
      <div>
        <UpdatePostComponent
          _id={id}
     
        />
      </div>
    );
  } else {
    console.log("nema id", id);

    return (
      <div>
        <UpdatePostComponent _id={0} isNewPostAdd={true} />
      </div>
    );
  }
};
export default UpdatePost;
