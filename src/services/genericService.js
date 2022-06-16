import MODELS from "../models/index";

/**
 * @author Navit Choudhary
 * @description Generic Service Template
 */
export default class GenericService {
    /**
     * 
     * @param {String} modelName Name of the Model
     */
    constructor(modelName) {
        if (!this.#isModelValid(modelName)) {
            console.error(`Invalid model name ${modelName}`);
            throw "Invalid model name '" + modelName + "'. Terminating app..."
        }

        this.modelName = modelName;
        this.objects = [];
    }

    /**
     * @private
     * @author Navit Choudhary
     * @description Validate if models exists
     * @param {String} modelName name of the model 
     */
    #isModelValid(modelName) {
        return !(!modelName || 0 === modelName.length || !MODELS.hasOwnProperty(modelName));
    }

    /**
     * @author Navit Choudhary
     * @description Update a record in DB
     * @param {Object} criteria 
     * @param {Object} data 
     * @param {Object} options 
     * @param {Function} callback 
     */
    updateRecord(criteria, data, options, callback) {
        data.updatedAt = Date.now();
        options.lean = true;
        options.new = true;
        MODELS[this.modelName].findOneAndUpdate(criteria, data, options, callback);
    }

    /**
     * @author Navit Choudhary
     * @description Insert a record in DB
     * @param {Object} data 
     * @param {Function} callback 
     */
    createRecord(data, callback) {
        MODELS[this.modelName](data).save(callback);
    }

    /**
     * @author Navit Choudhary
     * @description Hard delete a record
     * @param {Object} criteria 
     * @param {Function} callback 
     */
    deleteRecord(criteria, callback) {
        MODELS[this.modelName].findOneAndRemove(criteria, callback);
    }

    /**
     * @author Navit Choudhary
     * @description Retrive records
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} options 
     * @param {Function} callback 
     */
    getRecord(criteria, projection, options, callback) {
        options.lean = true;
        MODELS[this.modelName].find(criteria, projection, options, callback);
    }

    /**
     * @author Navit Choudhary
     * @description Retrive records while populating them
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} populate 
     * @param {Function} callback 
     */
    getPopulatedRecords(criteria, projection, populate, callback) {
        MODELS[this.modelName].find(criteria).select(projection).populate(populate).exec(callback)
    }

    /**
     * @author Navit Choudhary
     * @description Aggregate Records
     * @param {Object} criteria 
     * @param {Function} callback 
     */
    aggregate(criteria, callback) {
        MODELS[this.modelName].aggregate(criteria, callback);
    }


    /**
     * @author Navit Choudhary
     * @description get records using promise
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} options 
     */
    getRecordUsingPromise(criteria, projection, options) {
        options.lean = true;
        return new Promise((resolve, reject) => {
            MODELS[this.modelName].find(criteria, projection, options, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

}