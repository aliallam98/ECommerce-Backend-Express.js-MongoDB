



  
//   let pageNumber = Number(req.query.page)
//   let limit = req.query.size

import { ErrorClass } from "./ErrorClass.js"

//   if(!pageNumber) pageNumber = 1
//   export const Data = {
//     totalResults : await productModel.countDocuments(),
//     currentpageNumber :  pageNumber,
//     totalPage : Math.ceil((await productModel.countDocuments() / limit)),
//     ResultInPage : products.length

//   }


  // export const x = async(model,result,page,size)=>{
  //   if (page <= 0 || !page) page = 1;
  //   if (size <= 0 || !size) size = 5;
  //     return{
  //             totalResults : await model.countDocuments(),
  //             currentpageNumber :  Number(page),
  //             totalPages : Math.ceil((await model.countDocuments() / size)),
  //             ResultsInPage : result.length 
            
  //       }
  // }



  
// const sort = req.query.sort.replace(/,/g, ' ')
// console.log(sort);
//   let result = await productModel.aggregate([
//     { $match: {} },
//     { $sort : { price : -1 } },
//     {
//       $facet: {
//         metaData: [
//           { $count: "TotalDocuments" },
//           {
//             $addFields: {
//               pageNumber: Number(req.query.page),
//               totalPages: { $ceil: { $divide: ["$TotalDocuments", Number(req.query.size)] } },
//             },
//           },
//         ],
//         data: [
//           {
//             $skip: Number((req.query.page - 1) * req.query.size),
//           },
//           {
//             $limit: Number(req.query.size),
//           },
          
//         ],
//       },
//     },
//   ])
  // result =  result[0]
  // result.metaData = {...result.metaData[0] , count : result.data.length}

  // const dataInfo = await x(productModel,products,req.query.page,req.query.size)