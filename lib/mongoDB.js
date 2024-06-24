import mongoose from 'mongoose';
import chalk from 'chalk';

const {
    STATES
} = mongoose;
const defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000
};

export class mongoDB {
    constructor(url, options = defaultOptions) {
        this.url = url;
        this.options = options;
        this.data = this._data = {};
        this._schema = {};
        this._model = {};
        this.db = mongoose.createConnection(this.url, {
            ...this.options
        });
        this.logDBState();

        this.delete = {
            collection: async (collectionName) => {
                try {
                    await this.db.dropCollection(collectionName);
                    console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgYellow.black(`Collection '${collectionName}' deleted successfully`));
                } catch (error) {
                    console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgRed.black(`Error deleting collection '${collectionName}': ${error}`));
                }
            }
        };
        this.collection = mongoose.model;
    }

    async read() {
        try {
            await this.db;
            const schema = this._schema = new mongoose.Schema({
                data: {
                    type: Object,
                    required: true,
                    default: {}
                }
            });
            this._model = this.db.model('data', schema);
            this._data = await this._model.findOne({});
            this.data = this._data?.data ?? {};
            if (!this._data) {
                const [_ignored, _data] = await Promise.all([this.write(this.data), this._model.findOne({})]);
                this._data = _data;
                this.data = this._data?.data ?? {};
            }
            console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgYellow.black('Read successful'));
            return this.data;
        } catch (error) {
            console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgRed.black(`Read error: ${error}`));
        }
    }

    async write(data) {
        try {
            if (!data) throw new Error('Invalid data');
            const savedData = !this._data ? await (new this._model({
                data
            })).save() : await this._model.findOneAndUpdate({
                _id: this._data?._id
            }, {
                data
            }, {
                new: true
            });
            this.data = savedData?.data ?? {};
            console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgYellow.black('Write successful'));
            return savedData;
        } catch (error) {
            console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgRed.black(`Write error: ${error}`));
            throw error;
        }
    }

    logDBState() {
        const statusMessages = {
            [STATES.connecting]: chalk.bgBlue.black('MongoDB connecting...'),
            [STATES.connected]: chalk.bgGreen.black('MongoDB connected'),
            [STATES.disconnecting]: chalk.bgYellow.black('MongoDB disconnecting...'),
            [STATES.disconnected]: chalk.bgRed.black('MongoDB disconnected')
        };
        const status = this.db.readyState;
        console.log(chalk.bgYellow.black(" MongoDB \n"), chalk.yellow(">>\n"), statusMessages[status] || chalk.bgRed.black('Unknown MongoDB state'));
    }
}

export class mongoDBV2 {
    constructor(url, options = defaultOptions) {
        this.url = url;
        this.options = options;
        this.models = [];
        this.data = {};
        this.lists;
        this.list;
        this.db = mongoose.createConnection(this.url, {
            ...this.options
        });
        this.logDBState();

        this.delete = {
            collection: async (collectionName) => {
                try {
                    await this.db.dropCollection(collectionName);
                    console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgYellow.black(`Collection '${collectionName}' deleted successfully`));
                } catch (error) {
                    console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgRed.black(`Error deleting collection '${collectionName}': ${error}`));
                }
            }
        };
        this.collection = this.db.model;
    }

    async read() {
        try {
            await this.db;
            const schema = new mongoose.Schema({
                data: [{
                    name: String
                }]
            });
            this.list = this.db.model('lists', schema);
            this.lists = await this.list.findOne({});
            if (!this.lists?.data) {
                await this.list.create({
                    data: []
                });
                this.lists = await this.list.findOne({});
            }
            const garbage = [];
            for (const {
                    name
                }
                of this.lists?.data ?? []) {
                let collection;
                try {
                    collection = this.db.model(name, new mongoose.Schema({
                        data: Array
                    }));
                } catch (e) {
                    console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), e);
                    try {
                        collection = this.db.model(name);
                    } catch (e) {
                        garbage.push(name);
                        console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), e);
                    }
                }
                if (collection) {
                    this.models.push({
                        name,
                        model: collection
                    });
                    const collectionsData = await collection.find({});
                    this.data[name] = Object.fromEntries(collectionsData.map(v => v.data));
                }
            }
            const updatedList = await this.list.findOneAndUpdate({
                _id: this.lists?._id
            }, {
                data: this.lists.data.filter(v => !garbage.includes(v.name))
            }, {
                new: true
            });
            if (!updatedList) throw new Error('List not found');
            console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgYellow.black('Read successful'));
            return this.data;
        } catch (error) {
            console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgRed.black(`Read error: ${error}`));
        }
    }

    async write(data) {
        try {
            if (!this.lists || !data) throw new Error('Invalid data or lists');
            const listDoc = [];
            for (const key of Object.keys(data)) {
                const index = this.models.findIndex(v => v.name === key);
                const doc = index !== -1 ? this.models[index].model : this.db.model(key, new mongoose.Schema({
                    data: Array
                }));
                this.models[index === -1 ? this.models.length : index] = {
                    name: key,
                    model: doc
                };
                const docData = Object.entries(data[key]).map(v => ({
                    data: v
                }));
                await doc.deleteMany().catch(console.error);
                await doc.insertMany(docData);
                if (doc && key) listDoc.push({
                    name: key
                });
            }
            const listDocData = listDoc.map(doc => ({
                ...doc,
                _id: doc._id || new mongoose.Types.ObjectId()
            }));
            const updatedList = await this.list.findOneAndUpdate({
                _id: this.lists?._id
            }, {
                data: listDocData
            }, {
                new: true
            });
            if (!updatedList) throw new Error('List not found');
            console.log(chalk.bgGreen.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgYellow.black('Write successful'));
            return true;
        } catch (error) {
            console.log(chalk.bgRed.black(" MongoDB \n"), chalk.yellow(">>\n"), chalk.bgRed.black(`Write error: ${error}`));
            throw error;
        }
    }

    logDBState() {
        const statusMessages = {
            [STATES.connecting]: chalk.bgBlue.black('MongoDB connecting...'),
            [STATES.connected]: chalk.bgGreen.black('MongoDB connected'),
            [STATES.disconnecting]: chalk.bgYellow.black('MongoDB disconnecting...'),
            [STATES.disconnected]: chalk.bgRed.black('MongoDB disconnected')
        };
        const status = this.db.readyState;
        console.log(chalk.bgYellow.black(" MongoDB \n"), chalk.yellow(">>\n"), statusMessages[status] || chalk.bgRed.black('Unknown MongoDB state'));
    }
}
