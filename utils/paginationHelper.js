exports.paginate = (data, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data.slice(startIndex, endIndex);

    return {
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(data.length / limit),
        data: paginatedData,
    };
};
