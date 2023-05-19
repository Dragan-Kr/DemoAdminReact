import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import UpdatePostComponent from "./UpdatePostComponent";
import axios from "axios";
import { POST_API } from "../globalVariables";

import PostService from "../services/PostService";

import { CATEGORY_API } from "../globalVariables";

const UpdatePost = (props) => {
  let { id } = useParams();

  let [preselectedCategories, setPreselectedCategories] = useState([]);
  let [preselectedCategoriesArray, setPreselectedCategoriesArray] = useState(
    []
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(`${POST_API}/${id}`);
        setPreselectedCategories(res.data.post.categories);
        console.log(
          "UpdatePost -> setPreselectedCategories",
          preselectedCategories
        );

        const promises = preselectedCategories.map((categoryId) =>
          axios
            .get(`${CATEGORY_API}/${categoryId}`)
            .then((res) => res.data.category)
        );

        const categoriesData = await Promise.all(promises);
        const preselectedCategoriesArray = categoriesData.map((category) => ({
          value: category._id,
          label: category.name,
        }));

        setPreselectedCategoriesArray(preselectedCategoriesArray);
        console.log(
          "UpdatePost -> setPreselectedCategoriesArray",
          preselectedCategoriesArray
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (id !== undefined) {
    console.log("ima id");
    return (
      <div>
        {console.log(
          "UpdatePost->preselectedCategoriesArray",
          preselectedCategoriesArray
        )}

        <UpdatePostComponent
          _id={id}
          preselectedCategoriesArray={preselectedCategoriesArray}
        />
      </div>
    );
  } else {
    console.log("id je 0", id);

    return (
      <div>
        <UpdatePostComponent _id={0} />
      </div>
    );
  }
};
export default UpdatePost;
