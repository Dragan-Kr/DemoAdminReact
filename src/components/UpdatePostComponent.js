import React, { Component } from "react";
import axios from "axios";
// import Select from "react-select";
import PostService from "../services/PostService";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormGroup, Label, Input, NavLink } from "reactstrap";
// import { Form } from "react-bootstrap";
// import { FormText } from "reactstrap";
import { DatePicker } from "reactstrap-date-picker";
import { Multiselect } from "multiselect-react-dropdown";
// import { MultiSelect } from "primereact/multiselect";

import Isvg from "react-inlinesvg";
import Save from "../images/save.svg";
import Plus from "../images/plus.svg";
import Cancel from "../images/cancel.svg";
import Arrow from "../images/arrow.svg";

import FormData from "form-data";

import { IMAGE_API } from "../globalVariables";
import { WRITER_API } from "../globalVariables";
import { CATEGORY_API } from "../globalVariables";
import { API_REST } from "../globalVariables";
import { NOT_FOUND_IMAGE } from "../globalVariables";
import WriterService from "../services/WriterService";
import AppContext from "../context/AppContext";
import { NEWS_LIST } from "../globalVariables";
class UpdatePostComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: props._id,
      isNewPostAdd: props.isNewPostAdd,
      title: "",
      shortDescription: "",
      mainContent: "",
      isPublished: false,
      postDate: new Date(),
      createdBy: "",
      categories: [],
      selectedOptions: "",
      images: [],
      images2: [],
      firstCategories: [],
      writers: [],
      preselectedWriterId: "",
      writerName: "",
      preselectedCategories: [],
      preselectedCategoriesArray: [], //props.preselectedCategoriesArray
      preselectedWriter: [],
      selectedWriter: "",
      valueArray: [],
      imageFile: [],
      imageFileForBlob: [],
      tempImageArray: [],
      preselectedImages: [],
      imagesNames: [],
      imagesFiles: [],
      imageIndex: 0,
      preselectedAndNewImagesLoc: [],
      updatedRecord: [],
      categoriesValues: [],
      emptyPreselectedCategoryList: { value: "1", label: "-" },

      showAlert: false,
      showAlertTitle: false,
      showAlertWriter: false,
      showAlertCategory: false,
      errorMessage: {},
    };

    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeShortDescriptionHandler =
      this.changeShortDescriptionHandler.bind(this);
    this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
    this.changeIsPublishedHandler = this.changeIsPublishedHandler.bind(this);
    this.changePostDateHandler = this.changePostDateHandler.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleWriterSelect = this.handleWriterSelect.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.getWriter = this.getWriter.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static contextType = AppContext;

  async componentDidMount() {
    //pokrece se isklucivo jednom,odmah nakon refresovanja
    console.log("componentDidMount1");
    const contextValue = this.context;
    console.log("ComponentDidMount->contextValue", contextValue);

    const config = {
      headers: {
        Authorization: `Bearer ${contextValue.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    console.log("ComponentDidMount->config", config);

    if (contextValue.accessToken.length > 0) {
      console.log(
        "UpdatePostComponent->componentDidMount->usao u if",
        contextValue.accessToken
      );

      if (this.state.isNewPostAdd === true) {
        this.getListOfWriters(config);
        this.getListOfCategories(config);
      } else {
        this.setState({isNewPostAdd:false})
        console.log("UpdatePost-id", this.state._id);
        await PostService.getPostById(this.state._id, config).then((res) => {
          this.setState(
            {
              title: res.data.post.title,
              shortDescription: res.data.post.shortDescription,
              mainContent: res.data.post.mainContent,
              isPublished: res.data.post.isPublished,
              postDate: res.data.post.postDate,
              createdBy: res.data.post.createdBy,
              categories: res.data.post.categories,
              preselectedCategories: res.data.post.categories,
              index: res.data.post.index,
              preselectedWriterId: res.data.post.createdBy,
              imagesNames: res.data.post.images,
              // selectedOptions:this.state.preselectedCategoriesArray
            },
            () => {
              this.getPreselectedWriter(config);
              this.getListOfWriters(config);
              this.getListOfCategories(config);
              this.getListOfPreselectedCategories(config);
            }
          );
        });
      }
    }
  }

  handleInputBlur = (e) => {
    //ovo je ako preskocimo neko polje--treba dorada
    console.log("Blur->e", e.target);
    if (e.target.name === "title" && this.state.title.trim() === "") {
      this.setState({ showAlertTitle: true });
    }
    if (e.target.name === "writer" && this.state.selectedWriter === "") {
     
      if (this.state.preselectedWriterId !== "") {
        this.setState({ showAlertWriter: false });
      } else {
        this.setState({ showAlertWriter: true });
      }
    }

    if ((e.target.name === "category_input" && this.state.selectedOptions === "") || (e.target.name === "category_input" && this.state.selectedOptions.length === 0)) {
      console.log("handleInputBlur->category");

      if (this.state.preselectedCategories.length > 0) {
        if(this.state.isNewPostAdd === false){
          console.log("USO SAM BRE")

          this.setState({ showAlertCategory: true });
        }else {
          this.setState({ showAlertCategory: false });

        }
      } else {
        this.setState({ showAlertCategory: true });
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.errorMessage !== this.state.errorMessage) {
      // Clear the previous timer if it exists
      clearTimeout(this.dismissTimer);

      // Show the alert for 3 seconds (3000 milliseconds)
      this.showAlertWithTimeout(this.state.errorMessage, 63000);
    }
    if (
      this.state.imagesFiles !== prevState.imagesFiles &&
      this.state.imagesFiles.length > 0
    ) {
      const newImagesNames = Array.from(this.state.imagesFiles).map(
        (file) => "/uploads/" + file.name
      );
      const mergedFileNamesArray = [
        ...this.state.imagesNames,
        ...newImagesNames,
      ];
      this.setState(
        { preselectedAndNewImagesLoc: mergedFileNamesArray },
        () => {
          console.log("UPDATED STATE:", this.state.imagesNames);
        }
      );
    }
    if (prevState.title !== this.state.title) {
      this.setState({ showAlertTitle: false });
    }

    if (prevState.selectedWriter !== this.state.selectedWriter) {
      this.setState({ showAlertWriter: false });
    }
    if (prevState.selectedOptions !== this.state.selectedOptions) {
      this.setState({ showAlertCategory: false });
    }
  }

  showAlertWithTimeout(message, duration) {
    this.setState({
      showAlert: true,
      showAlertTitle: true,
      showAlertWriter: true,
      showAlertCategory: true,
      errorMessage: message,
    });

    this.dismissTimer = setTimeout(() => {
      this.setState({ showAlert: false });
    }, duration);
  }

  async getPreselectedWriter(config) {
    console.log("USAO U getPreselectedWriter->config", config);

    let preselectedWriter = [];
    await axios
      .get(WRITER_API + "/" + this.state.createdBy, config)
      .then((res) => {
        preselectedWriter.push(res.data.writer);

        const preselectedWriter2 = preselectedWriter.map((d) => ({
          value: d._id,
          label: d.name + " " + d.lastName,
        }));

        this.setState({ preselectedWriter: preselectedWriter2 });
      })
      .catch(function (error) {
        console.log("Error in fetching market updates");
      });
  }

  async getListOfPreselectedCategories(config) {
    console.log("USAO U getListOfPreselectedCategories->config", config);
    let preselectedCategoriesArray = [];
    for (let index in this.state.preselectedCategories) {
      if (
        typeof index === "undefined" ||
        index < 0 ||
        index >= this.state.preselectedCategories.length
      ) {
        console.log("Invalid index value:", index);
        return;
      }

      await axios
        .get(
          CATEGORY_API + "/" + this.state.preselectedCategories[index],
          config
        )
        .then((res) => {
          console.log("getListOfPreselectedCategories=>res.data", res.data);
          preselectedCategoriesArray.push(res.data.category);
          console.log(
            "then=>preselectedCategoriesArray",
            preselectedCategoriesArray
          );

          const preselectedCategoriesArray2 = preselectedCategoriesArray.map(
            (d) => ({
              value: d._id,
              label: d.name,
            })
          );

          this.setState(
            {
              preselectedCategoriesArray: preselectedCategoriesArray2,
            },
            () => {
              const categoriesValues = preselectedCategoriesArray.map((d) => ({
                value: d.name,
              }));

              this.setState({ categoriesValues: categoriesValues });

              console.log(
                "preselectedCategoriesArray2",
                preselectedCategoriesArray2
              );
            }
          );
        })
        .catch(function (error) {
          console.log("Error in fetching data");
        });
    }
  }

  updatePost(e) {
    e.preventDefault();
    const contextValue = this.context;
    const config = {
      headers: {
        Authorization: `Bearer ${contextValue.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (this.state.isNewPostAdd === true) {
      ///OVDE TREBA isNewPostAdd
      console.log("Create new post");
      const selectedCategories =
        this.state.selectedOptions.length > 0
          ? this.state.selectedOptions.map((item) => item.value)
          : [];
      console.log("this.state.selectedOptions", this.state.selectedOptions);
      const formData = new FormData();

      if (this.state.imagesFiles.length > 0) {
        const imagesForm = [];
        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          formData.append("images2", this.state.imagesFiles[i]);
          imagesForm.push(formData);
        }
        //Array of files converting to array of objects
        const filesArray = [];
        // Loop through the array of files
        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          const file = this.state.imagesFiles[i];
          const reader = new FileReader();

          // Use the FileReader API to read the contents of the file
          reader.readAsDataURL(file);

          // When the file is loaded, create an object and push it to the array
          reader.onload = function () {
            filesArray.push({
              name: file.name,
            });
          };
        }

        console.log("Ovo je filesArray", filesArray);

        const imagesNames = [];

        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          imagesNames.push(this.state.imagesFiles[i].name);
        }

        console.log("imagesNames je", imagesNames);

        let post = {
          title: this.state.title,
          shortDescription: this.state.shortDescription,
          mainContent: this.state.mainContent,
          isPublished: this.state.isPublished,
          postDate: this.state.postDate,
          categories: selectedCategories,
          createdBy: this.state.selectedWriter,
          images: this.state.preselectedAndNewImagesLoc,
        };

        console.log(" CREATED  POST", post);

        console.log("FORM DATA", formData);
        fetch(IMAGE_API, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${contextValue.accessToken}`,
           
            // Add other headers as needed
          },
        });

        console.log("Create post ->cofing", config);
        PostService.createPost(post, config)
          .then((res) => {
            console.log("This is response from createing post", res);
            window.location.replace(NEWS_LIST);
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              this.setState(
                { errorMessage: error.response.data.message, showAlert: true },
                () => {
                  console.log("errorMessage", this.state.errorMessage);
                }
              );
            } else {
              this.setState({
                errorMessage: "Registration failed.",
                showAlert: true,
              });
            }
          });
      } else {///KREIRANJE POSTA BEZ SLIKA
        let post = {
          title: this.state.title,
          shortDescription: this.state.shortDescription,
          mainContent: this.state.mainContent,
          isPublished: this.state.isPublished,
          postDate: this.state.postDate,
          categories: selectedCategories,
          createdBy: this.state.selectedWriter,
        };
        console.log("Postovanje bez slika->post", post);

        console.log("FORM DATA", formData);

        PostService.createPost(post, config)
          .then((res) => {
            console.log("Postovanje bez slika->res", res);
            window.location.replace(NEWS_LIST);
          })
          .catch((error) => {
            // window.alert('Post failed');
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              this.setState({ errorMessage: error.response.data.message, showAlert: true },
                () => {
                  console.log("errorMessage", this.state.errorMessage);
                }
              );
            } else {
              this.setState({
                errorMessage: "Post failed.",
                showAlert: true,
              });
            }
          });
      }
    }

    ///UPDATE
    else {
     
      if (this.state.selectedOptions === "") {//////NISU DODAVANE NOVE KATEGORIJE
        //categories nepromjenjen
        this.setState(
          { selectedOptions: this.state.preselectedCategoriesArray },
          () => {
            this.setState({ valueArray: this.state.selectedOptions }, () => {
              console.log(
                "OVO je this.state.selectedOptions",
                this.state.selectedOptions
              );
              console.log("UpdatePost=>=>valueArray", this.state.valueArray);
              const formData = new FormData();

              const imagesForm = [];
              for (let i = 0; i < this.state.imagesFiles.length; i++) {
                formData.append("images2", this.state.imagesFiles[i]);

                imagesForm.push(formData);
              }

              //Array of files converting to array of objects
              const filesArray = [];

              // Loop through the array of files
              for (let i = 0; i < this.state.imagesFiles.length; i++) {
                let file = this.state.imagesFiles[i];
                const reader = new FileReader();

                // Use the FileReader API to read the contents of the file
                console.log(
                  "Preselektovana slika koja treba da se procita",
                  file
                );
                reader.readAsDataURL(file);

                // When the file is loaded, create an object and push it to the array
                reader.onload = function () {
                  filesArray.push({
                    name: file.name,
                    //   type: file.type,
                    //   size: file.size,
                    //   data: reader.r
                  });
                };
              }

              // console.log("Ovo je filesArray", filesArray);

              let imagesNames = [];

              let imagesNames2 = [];
              for (let i = 0; i < this.state.imagesFiles.length; i++) {
                imagesNames.push(this.state.imagesFiles[i].name);
              }

              imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
              this.setState({ imagesNames: imagesNames2 });

              if (this.state.selectedWriter === "") {
                let valueArray2 = [];
                valueArray2 = this.state.valueArray.map((item) => item.value);

                this.setState(
                  { selectedWriter: this.state.preselectedWriter },
                  () => {
                    console.log(
                      "selectedWriter odmah ispod1",
                      this.state.selectedWriter
                    );
                    let selectedWriterValue = this.state.selectedWriter.map(
                      (item) => item.value
                    );

                    let post = [];
                    if (
                      this.state.imagesNames.length > 0 &&
                      this.state.preselectedAndNewImagesLoc.length === 0
                    ) {
                      post = {
                        title: this.state.title,
                        shortDescription: this.state.shortDescription,
                        mainContent: this.state.mainContent,
                        isPublished: this.state.isPublished,
                        postDate: this.state.postDate,
                        categories: valueArray2,
                        createdBy: selectedWriterValue[0],
                        images: this.state.imagesNames,
                      };
                    } else
                      post = {
                        title: this.state.title,
                        shortDescription: this.state.shortDescription,
                        mainContent: this.state.mainContent,
                        isPublished: this.state.isPublished,
                        postDate: this.state.postDate,
                        categories: valueArray2,
                        createdBy: selectedWriterValue[0],
                        images: this.state.preselectedAndNewImagesLoc,
                      };

                    fetch(IMAGE_API, {
                      method: "POST",
                      body: formData,
                      headers: {
                        Authorization: `Bearer ${contextValue.accessToken}`,
                        
                        // Add other headers as needed
                      },
                    });

                    PostService.updatePost(post, this.state._id, config)
                      .then((res) => {
                        // window.location.replace(NEWS_LIST);
                      })
                      .catch((error) => {
                        if (
                          error.response &&
                          error.response.data &&
                          error.response.data.message
                        ) {
                          this.setState(
                            { errorMessage: error.response.data.message, showAlert: true },
                            () => {
                              console.log("errorMessage", this.state.errorMessage);
                            }
                          );
                        } else {
                          this.setState({
                            errorMessage: "Post failed.",
                            showAlert: true,
                          });
                        }
                      });
                    console.log(
                      "valueArray izvan setState",
                      this.state.valueArray
                    );
                  }
                );
              } else {
                e.preventDefault();
                console.log(
                  "USAO U ELSE->WRITER PROMJENJEN A CATEGORIJE OSTALE ISTE"
                );
                const formData = new FormData();

                let imagesForm = [];
                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                  formData.append("images2", this.state.imagesFiles[i]);

                  imagesForm.push(formData);
                }

                //Array of files converting to array of objects
                const filesArray = [];

                // Loop through the array of files
                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                  const file = this.state.imagesFiles[i];
                  const reader = new FileReader();

                  // Use the FileReader API to read the contents of the file
                  reader.readAsDataURL(file);

                  // When the file is loaded, create an object and push it to the array
                  reader.onload = function () {
                    filesArray.push({
                      name: file.name,
                    });
                  };
                }

                let imagesNames = [];
                let imagesNames2 = [];

                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                  imagesNames.push(this.state.imagesFiles[i].name);
                  console.log(
                    "this.state.images2[i].name",
                    this.state.imagesFiles[i].name
                  );
                }
                imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
                this.setState({ imagesNames: imagesNames2 });

                let selectedOptionsValue = this.state.selectedOptions.map(
                  (item) => item.value
                );

                let post = [];
                if (
                  this.state.imagesNames.length > 0 &&
                  this.state.preselectedAndNewImagesLoc.length === 0
                ) {
                  post = {
                    title: this.state.title,
                    shortDescription: this.state.shortDescription,
                    mainContent: this.state.mainContent,
                    isPublished: this.state.isPublished,
                    postDate: this.state.postDate,
                    categories: selectedOptionsValue,
                    createdBy: this.state.selectedWriter,
                    images: this.state.imagesNames,
                  };
                } else {
                  post = {
                    title: this.state.title,
                    shortDescription: this.state.shortDescription,
                    mainContent: this.state.mainContent,
                    isPublished: this.state.isPublished,
                    postDate: this.state.postDate,
                    categories: selectedOptionsValue,
                    createdBy: this.state.selectedWriter,
                    images: this.state.preselectedAndNewImagesLoc,
                  };
                }

                console.log("POST iz elsa", post);

                fetch(IMAGE_API, {
                  method: "POST",
                  body: formData,
                  headers: {
                    Authorization: `Bearer ${contextValue.accessToken}`,
                    
                    // Add other headers as needed
                  },
                });

                PostService.updatePost(post, this.state._id, config)
                  .then((res) => {
                    // window.location.replace(NEWS_LIST);
                  })
                  .catch((error) => {
                    if (
                      error.response &&
                      error.response.data &&
                      error.response.data.message
                    ) {
                      this.setState(
                        { errorMessage: error.response.data.message, showAlert: true },
                        () => {
                          console.log("errorMessage", this.state.errorMessage);
                        }
                      );
                    } else {
                      this.setState({
                        errorMessage: "Post failed.",
                        showAlert: true,
                      });
                    }
                  });
              }
            });
          }
        );
      } else {////////// MJENJANA SELECTED OPTIONS
        const formData = new FormData();
        const imagesForm = [];
        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          formData.append("images2", this.state.imagesFiles[i]);
          imagesForm.push(formData);
        }

        //Array of files converting to array of objects
        const filesArray = [];

        // Loop through the array of files
        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          const file = this.state.imagesFiles[i];
          const reader = new FileReader();

          // Use the FileReader API to read the contents of the file
          reader.readAsDataURL(file);

          // When the file is loaded, create an object and push it to the array
          reader.onload = function () {
            filesArray.push({
              name: file.name,
            });
          };
        }

        let imagesNames = [];
        let imagesNames2 = [];

        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          imagesNames.push(this.state.imagesFiles[i].name);
        }

        imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
        this.setState({ imagesNames: imagesNames2 });

        let valueArrayOfSelectedCategories = [];
        valueArrayOfSelectedCategories = this.state.selectedOptions.map(
          (item) => item.value
        );

        if (this.state.selectedWriter !== "") {
          console.log("Izabrane vrijednosti i pisca i kategorije");

          let post = [];
          if (
            this.state.imagesNames.length > 0 &&
            this.state.preselectedAndNewImagesLoc.length === 0
          ) {
            post = {
              title: this.state.title,
              shortDescription: this.state.shortDescription,
              mainContent: this.state.mainContent,
              isPublished: this.state.isPublished,
              postDate: this.state.postDate,
              categories: valueArrayOfSelectedCategories,
              createdBy: this.state.selectedWriter,
              images: this.state.imagesNames,
            };
          } else {
            post = {
              title: this.state.title,
              shortDescription: this.state.shortDescription,
              mainContent: this.state.mainContent,
              isPublished: this.state.isPublished,
              postDate: this.state.postDate,
              categories: valueArrayOfSelectedCategories,
              createdBy: this.state.selectedWriter,
              images: this.state.preselectedAndNewImagesLoc,
            };
          }

          console.log("ELSE->POST", post);

          fetch(IMAGE_API, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${contextValue.accessToken}`,
           
              // Add other headers as needed
            },
          });

          PostService.updatePost(post, this.state._id, config)
            .then((res) => {
              // window.location.replace(NEWS_LIST);
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                this.setState(
                  { errorMessage: error.response.data.message, showAlert: true },
                  () => {
                    console.log("errorMessage", this.state.errorMessage);
                  }
                );
              } else {
                this.setState({
                  errorMessage: "Post failed.",
                  showAlert: true,
                });
              }
            
            });
        } else {
          //pisac ostao nepromjenjen

          let valueArrayOfSelectedCategories = [];
          valueArrayOfSelectedCategories = this.state.selectedOptions.map(
            (item) => item.value
          );
          let post = [];
          if (
            this.state.imagesNames.length > 0 &&
            this.state.preselectedAndNewImagesLoc.length === 0
          ) {
            post = {
              title: this.state.title,
              shortDescription: this.state.shortDescription,
              mainContent: this.state.mainContent,
              isPublished: this.state.isPublished,
              postDate: this.state.postDate,
              categories: valueArrayOfSelectedCategories,
              createdBy: this.state.preselectedWriterId,
              images: this.state.imagesNames,
            };
          } else {
            post = {
              title: this.state.title,
              shortDescription: this.state.shortDescription,
              mainContent: this.state.mainContent,
              isPublished: this.state.isPublished,
              postDate: this.state.postDate,
              categories: valueArrayOfSelectedCategories,
              createdBy: this.state.preselectedWriterId,
              images: this.state.preselectedAndNewImagesLoc,
            };
          }

          fetch(IMAGE_API, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${contextValue.accessToken}`,
              
            },
          });

          PostService.updatePost(post, this.state._id, config)
            .then((res) => {
              // window.location.replace(NEWS_LIST);
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                this.setState(
                  { errorMessage: error.response.data.message, showAlert: true },
                  () => {
                    console.log("errorMessage", this.state.errorMessage);
                  }
                );
              } else {
                this.setState({
                  errorMessage: "Post failed.",
                  showAlert: true,
                });
              }
            });
        }
      }
    }
  }

  changeTitleHandler(event) {
    const newTitle = event.target.value;
    this.setState({ title: newTitle }, () => {
      this.setState((prevState) => ({
        updatedRecord: [
          ...prevState.updatedRecord,
          { name: "title", value: newTitle },
        ],
      }));
    });
  }

  changeShortDescriptionHandler(event) {
    this.setState({ shortDescription: event.target.value });
  }

  changeMainContentHandler(event) {
    this.setState({ mainContent: event.target.value });
  }

  changeIsPublishedHandler(event) {
    this.setState({ isPublished: event.target.checked });
  }

  changePostDateHandler(event) {
    console.log("changePostDateHandler->event", event);
    this.setState({ postDate: event }, () => {
      console.log("POST DATE", this.state.postDate);
    });
  }

  handleSelect(event) {
    this.setState({ selectedOptions: event });
  }

  handleChange = (event) => {
    console.log("handleChange->event", event);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleWriterSelect(event) {
    console.log("handleWriterSelect->EVENT", event);
    if (this.state.preselectedWriter.length > 0) {
      console.log("RADI provjera");
    }
    this.setState({ selectedWriter: event }, () => {
      console.log("SELECTED WRITER", event.target);
      console.log(
        "handleWriterSelect=>selectedWriter",
        this.state.selectedWriter
      );
    });
  }

  getWriter() {
    return this.state.writers.map((writer) => {
      return <option value={writer.value}>{writer.label}</option>;
    });
  }

  handleDrop = (event) => {
    event.preventDefault();
    console.log("handleDrop");

    if (event.dataTransfer.files.length > 0) {
      const files = event.dataTransfer.files;
      console.log("Usao u handleDrop");
      console.log("files", files);
      // const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      const filesArray = Array.from(event.dataTransfer.files);

      console.log("filesArray", filesArray);
      this.setState((prevState) => ({
        imagesFiles: [...prevState.imagesFiles, ...filesArray],
      }));
    } else {
      console.log("No images droped");
    }
  };

  handleDragOver = (event) => {
    event.preventDefault();
  };

  handleOneWriterChange(e) {
    this.setState({ preselectedWriter: e.value, name: e.label });
  }

  handleImages = (event) => {
    let files = event.target.files;
    console.log("HANDLE IMAGES->FILES", files);

    const mergedFilesArray = [...this.state.imagesFiles, ...files];
    this.setState({ imagesFiles: mergedFilesArray });

    // this.setState({ imagesFiles: files });
  };

  handleImageDelete = (index) => {
    if (
      this.state.imagesNames.length > 0 &&
      this.state.imagesFiles.length > 0 &&
      this.state.preselectedAndNewImagesLoc.length > 0
    ) {
      //predefinisani i novo kreirani
      console.log("Prvi if");
      let newIndex = index + this.state.imagesNames.length;
      console.log("NewIndex", newIndex);
      const preselectedAndNewImagesLoc = [
        ...this.state.preselectedAndNewImagesLoc,
      ];
      preselectedAndNewImagesLoc.splice(newIndex, 1);
      this.setState({ preselectedAndNewImagesLoc: preselectedAndNewImagesLoc });

      const imagesFilesArray = [...this.state.imagesFiles];
      imagesFilesArray.splice(index, 1);
      this.setState({ imagesFiles: imagesFilesArray });
    } else if (this.state.imagesNames.length > 0) {
      console.log("Onlu predefined images");
      console.log("Index", index);
      const imagesNames = [...this.state.imagesNames];
      imagesNames.splice(index, 1);
      this.setState({ imagesNames: imagesNames });

      if (this.state.preselectedAndNewImagesLoc.length > 0) {
        const preselectedAndNewImagesLoc = [
          ...this.state.preselectedAndNewImagesLoc,
        ];
        preselectedAndNewImagesLoc.splice(index, 1);
        this.setState({
          preselectedAndNewImagesLoc: preselectedAndNewImagesLoc,
        });
      }
    } else {
      //samo novo kreirane
      const imagesFilesArray = [...this.state.imagesFiles];
      imagesFilesArray.splice(index, 1);
      this.setState({ imagesFiles: imagesFilesArray }, () => {
        if (this.state.imagesFiles.length === 0) {
          this.setState({ preselectedAndNewImagesLoc: [] });
        }
      });
    }
  };

  onRemove = (selectedList, removedItem) => {
    console.log("SelectedList", selectedList);
    console.log("RemovedItem", removedItem);
    // const newArray = this.state.selectedOptions.filter(obj => obj.id !== value);
    this.setState({ selectedOptions: selectedList });
  };

  render() {
    const skippedTitleField = "Please provide title";
    const skippedWriterField = "Choose a writer";
    const skippedCategoryField = "Choose a category";

    const titleDivId = "title";
    const writerDivId = "writer";
    const categoryDivId = "category";

    const dateObject = new Date(this.state.postDate);
    const defaultDate = dateObject.toISOString().slice(0, 10);

    // const getListOfPreselectedCategories = this.getListOfPreselectedCategories();

    {
      console.log("ContextValueeeeee", this.context);
    }

    return (
      <form>
        <div className="heading-post">
          {this.state.isNewPostAdd === true ? (
            <h1>Add Post</h1>
          ) : (
            <h1>Update Post</h1>
          )}
          <div className="top-btns">
            <button className="save-button" onClick={this.updatePost}>
              <Isvg src={Save} />
              Save
            </button>
          </div>
        </div>
        <div className="add-news-content">
          <div className="left-form">
            <input
              className="title-input"
              name="title"
              placeholder="Title"
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
              onBlur={this.handleInputBlur}
            />
            {/* {this.state.errorMessage.title !== "" && (
                          <div className="empty-field-login">
                            {this.state.showAlertTitle && (
                              <p
                                id={titleDivId}
                                className="warning-paragraph"
                              >
                                {this.state.errorMessage.title ||
                                  skippedTitleField}
                              </p>
                            )}
                          </div>
              )} */}
            {/* /////////////////////////// */}

            { this.state.errorMessage.title  ? (
              <div className="empty-field-login">
                <p className="warning-paragraph">
                  {console.log("this.state.errorMessage.title",this.state.errorMessage.title)}
                  {this.state.errorMessage.title}
                </p>
              </div>
            ) : (
              this.state.showAlertTitle && (
                <div className="empty-field-login">
                  <p id={titleDivId} className="warning-paragraph">
                    {skippedTitleField}
                  </p>
                </div>
              )
            )}

            {/* ////////////////////// */}
            <h2>Content</h2>
            <div className="textarea-content">
              <label>Short description</label>
              <textarea
                rows="5"
                cols="50"
                name="shortDescription"
                placeholder="Short content of the editor..."
                value={this.state.shortDescription}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <div className="textarea-content">
              <label>Main content</label>
              <textarea
                name="mainContent"
                rows="20"
                cols="50"
                placeholder="Content of the editor..."
                value={this.state.mainContent}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <div className="image-uploader">
              <h4>Images</h4>
              <fieldset className="form-group">
                <input
                  type="file"
                  id="pro-image"
                  name="pro-image"
                  style={{ display: "none" }}
                  className="form-control"
                  multiple
                  onInput={(event) => {
                    this.handleImages(event);
                  }}
                />
              </fieldset>

              <div
                className="preview-images-zone"
                onDrop={this.handleDrop.bind(this)}
                onDragOver={this.handleDragOver.bind(this)}
              >
                {/* /// */}
                {this.state.imagesNames.length > 0 ? ( //kada ne dodajemo nove slike osim predefinisanih
                  this.state.imagesNames.map((image, index) => (
                    <div
                      className={`preview-image preview-show-${index + 1}`}
                      key={index}
                    >
                      <div
                        className="image-cancel"
                        data-no={index + 1}
                        onClick={() => this.handleImageDelete(index)}
                        key={index}
                      >
                        <Isvg src={Cancel} />
                      </div>

                      <div className="image-zone">
                        <img
                          id={`pro-img-${index + 1}`}
                          src={`${API_REST}${image}`}
                          alt=""
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = `${API_REST}${NOT_FOUND_IMAGE}`;
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div></div>
                )}

                {/* ///// */}

                {this.state.imagesFiles.length > 0 ? ( //dodajemo nove slike bez predhodnih
                  Array.from(this.state.imagesFiles).map((item, index) => (
                    <div
                      className={`preview-image preview-show-${index + 1}`}
                      key={index}
                    >
                      <div
                        className="image-cancel"
                        data-no={index + 1}
                        onClick={() => this.handleImageDelete(index)}
                        key={index}
                      >
                        <Isvg src={Cancel} />
                      </div>

                      <div className="image-zone">
                        <img
                          id={`pro-img-${index + 1}`}
                          src={URL.createObjectURL(item)}
                          alt=""
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div></div>
                )}

                {/* ////// */}

                {/* <a
                  href="javascript:void(0)"
                  onClick={() => document.getElementById("pro-image").click()}
                > */}
                <NavLink
                  to="#"
                  // href="javascript:void(0)"
                  onClick={() => document.getElementById("pro-image").click()}
                >
                  <div className="uploader-add-link">
                    <Isvg src={Plus} />
                    <span className="span1">Upload a File</span>
                    <span className="span2"> or drag and drop</span>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="right-form">
            <div className="select-content">
              {/* <label>Written By</label>
              <Select
                options={this.state.writers}
                value={
                  this.state.selectedWriter
                    ? this.state.selectedWriter
                    : this.state.preselectedWriter
                }
                onChange={this.handleWriterSelect}
                styles={colourStyles}
              /> */}

              {/* <FormGroup>
                <Label for="exampleSelect">Written By</Label>
                <Input
                  id="exampleSelect"
                  name="select"
                  type="select"
                  onChange={this.handleWriterSelect}
                >
                  {this.state.writers.map((option) => (
                    <option
                      key={option.value}
                      selected={
                        option?.value === this.state.preselectedWriterId
                          ? true
                          : false
                      }
                      // value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </Input>
              </FormGroup> */}

              <FormGroup>
                <Label for="exampleSelect">Written By</Label>
                <Input
                  id="exampleSelect"
                  // name="select"
                  name="writer"
                  type="select"
                  onChange={(event) =>
                    this.handleWriterSelect(event.target.value)
                  }
                  onBlur={this.handleInputBlur}
                >
                  <option value="" disabled selected hidden>
                    Select a writer
                  </option>{" "}
                  {/* Placeholder option */}
                  {this.state.writers.map((option) => (
                    <option
                      key={option.value}
                      selected={
                        option?.value === this.state.preselectedWriterId
                          ? true
                          : false
                      }
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </div>
            {this.state.errorMessage.writer && (
              <div className="empty-field-login">
                {this.state.showAlertWriter && (
                  <p id={writerDivId} className="warning-paragraph">
                  {console.log("this.state.errorMessage.writer",this.state.errorMessage.writer)}

                    {this.state.errorMessage.writer
                      ? this.state.errorMessage.writer
                      : skippedWriterField}
                  </p>
                )}
              </div>
            )}

            <div className="date-content">
              {/* <label>Post Date</label>
              <input
                className="date-input"
                type="date"
                value={defaultDate}
                onChange={this.changePostDateHandler}
              /> */}
              <Label>Post Date</Label>
              <FormGroup>
                <DatePicker
                  className="date-input"
                  id="example-datepicker"
                  value={defaultDate}
                  onChange={this.changePostDateHandler}
                />
              </FormGroup>
            </div>

            <div className="categories-content">
              <label>Categories</label>
              <Isvg className="arrow-categories" src={Arrow} />
              {/* <Select
                options={this.state.categories}
                placeholder="Select category"
                value={
                  this.state.selectedOptions
                    ? this.state.selectedOptions
                    : this.state.preselectedCategoriesArray
                }
                onChange={this.handleSelect}
                isSearchable={true}
                isMulti
                styles={colourStyles}
                autoFocus={true}
              /> */}

              {/* {() => {
                this.getListOfPreselectedCategories();
                {console.log("niz2", this.state.preselectedCategoriesArray)}
                return (
                  <Multiselect
                    options={this.state.categories || []}
                    displayValue="label"
                    selectedValues={
                      this.state.selectedOptions
                        ? this.state.selectedOptions
                        : this.state.preselectedCategoriesArray
                    }
                    onSelect={this.handleSelect}
                    hidePlaceholder="true"
                    showArrow="false"
                    onRemove={this.onRemove}
                    closeIcon="cancel"
                  />
                );
              }} */}

              <div name="category" onBlur={this.handleInputBlur}>
                <Multiselect
                  options={this.state.categories || []}
                  displayValue="label"
                  name="category"
                  selectedValues={
                    this.state.selectedOptions
                      ? this.state.selectedOptions
                      : this.state.preselectedCategoriesArray
                  } //kada ubacim samo values onda ne pravi problem tj.this.state.preselectedCategoriesArray pravi problem tj.aman da se ne poziva na vrijeme
                  // value={
                  //   //na njihovom primjeru nema value samo selectedValues
                  //   this.state.selectedOptions || []
                  // }
                  onSelect={this.handleSelect}
                  hidePlaceholder="true"
                  showArrow="false"
                  onRemove={this.onRemove}
                  closeIcon="cancel"
                  placeholder="Select categories"
                />

                {/* <Multiselect //poslednje novo
                value={
                  this.state.selectedOptions
                    ? this.state.selectedOptions
                    : this.state.preselectedCategoriesArray
                }
                onChange={this.handleSelect}
                options={this.state.categories || []}
                optionLabel="label"
              /> */}
              </div>
            </div>

            {this.state.errorMessage.category  && (
              <div className="empty-field-login">
                {this.state.showAlertCategory && (
                  <p id={categoryDivId} className="warning-paragraph">
                    {this.state.errorMessage.category
                      ? this.state.errorMessage.category
                      : skippedCategoryField}
                  </p>
                )}
              </div>
            )}

            <div className="published-content">
              <label>Published</label>
              <label className="switch">
                <input
                  type="checkbox"
                  value={this.state.isPublished}
                  checked={this.state.isPublished}
                  onChange={this.changeIsPublishedHandler}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <div></div>
      </form>
    );
    // }
  }

  async getListOfWriters(config) {
    const res = await axios.get(WRITER_API, config);
    console.log("getListOfWriters->res", res);
    const writers = res.data.writers.map((d) => ({
      value: d._id,
      label: d.name + " " + d.lastName,
    }));
    this.setState({ writers: writers }, () => {
      console.log("writers su:" + JSON.stringify(writers));
    });
  }

  handleWriterChange(e) {
    this.setState({ createdBy: e.value, name: e.label }, () => {
      console.log(
        "Ovo je createdBy iz handleWriterChange",
        this.state.createdBy
      );
    });
  }

  async getListOfCategories(config) {
    console.log("getListOfCategories->config", config);
    const res = await axios.get(CATEGORY_API, config);
    const categories = res.data.categories.map((d) => ({
      value: d._id,
      label: d.name,
    }));
    this.setState({ categories: categories });
  }

  handleCategoryChange(e) {
    this.setState({ categories: e.value, name: e.label });
  }
}
export default UpdatePostComponent;
