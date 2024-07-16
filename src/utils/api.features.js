import { ErrorClass } from "./ErrorClass.js";

export const ApiFeatures = async (model, reqQuery,condition) => {
  try {
    let { query, sort, order, page, limit, fields, ...filters } = reqQuery;
    let conditions = condition || {}

    if (filters) {
      let queryFiltersCopy = { ...filters };
      queryFiltersCopy = JSON.parse(
        JSON.stringify(queryFiltersCopy).replace(
          /(gt|gte|lt|lte)/g,
          (match) => `$${match}`
        )
      );
      conditions = { ...conditions, ...queryFiltersCopy };
    }

    // Search
    if (query && query !== "") {
      conditions.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Pagination
    //  page = parseInt(page)
    if (page <= 0 || !page) page = 1;
    // limit = parseInt(limit)
    if (limit <= 0 || !limit) limit = 8;
    const skip = (page - 1) * limit;

    sort = reqQuery.sort || "createdAt";
    order = reqQuery.order || "desc";

    console.log(query);
    const results = await model
      .find(conditions)
      .sort(sort + " " + order)
      .skip(skip)
      .limit(limit)
      .select(fields);
    const metaData = await getMetaData(model,condition,{ page, limit });

    return {
      results,
      metaData,
    };
  } catch (error) {
    return new ErrorClass(error.message);
  }
};
export const getMetaData = async (model,condition = {}, { page = 1, limit = 10 } = {}) => {
  try {
    const totalDocuments = await model.countDocuments(condition);

    const totalPages = Math.ceil(totalDocuments / limit);
    const nextPage = totalPages > page ? page + 1 : null; // Use null for empty
    const previousPage = page > 1 ? page - 1 : null;

    return {
      totalDocuments,
      totalPages,
      nextPage,
      previousPage,
      currentPage: Number(page),
      resultsPerPage: Number(limit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve metadata: ${error.message}`); // Rethrow with context
  }
};
