const mongodb = require("mongodb");
const db = require("../data/database");

class Contact {
  constructor(fullname, email, subject, message, id = null) {
    this.fullname = fullname;
    this.email = email;
    this.subject = subject;
    this.message = message;
    if (id) {
      this.id = id.toString();
    }
  }

  async contact() {
    await db.getDb().collection("enquiries").insertOne({
      fullname: this.fullname,
      email: this.email,
      subject: this.subject,
      message: this.message,
    });
  }

  static async findAll() {
    const contacts = await db.getDb().collection("enquiries").find().toArray();
    return contacts.map((contactDoc) => {
      return new Contact(
        contactDoc.fullname,
        contactDoc.email,
        contactDoc.subject,
        contactDoc.message,
        contactDoc._id
      );
    });
  }

  static async findById(contactId) {
    let contId;
    try {
      contId = new mongodb.ObjectId(contactId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const contact = await db
      .getDb()
      .collection("enquiries")
      .findOne({ _id: contId });

    if (!contact) {
      const error = new Error("Could not find contact with provided id.");
      error.code = 404;
      throw error;
    }

    return new Contact(
      contact.fullname,
      contact.email,
      contact.subject,
      contact.message,
      contact._id
    );
  }

  static async saveResponse(contactId, response) {
    try {
      const contId = new mongodb.ObjectId(contactId); // Convert string to ObjectId
      await db
        .getDb()
        .collection("enquiries")
        .updateOne(
          { _id: contId }, // Find the document by _id
          { $set: { response: response, responded: true } }
        );
    } catch (error) {
      throw new Error("Failed to save response: " + error.message);
    }
  }

  async update() {
    if (this.id) {
      const contactId = new mongodb.ObjectId(this.id);
      const responded = "responded";
      await db
        .getDb()
        .collection("enquiries")
        .updateOne(
          { _id: contactId },
          {
            $set: {
              status: responded,
            },
          }
        );
    }
  }

  async remove() {
    if (this.id) {
      const contactId = new mongodb.ObjectId(this.id);
      await db.getDb().collection("enquiries").deleteOne({ _id: contactId });
    }
  }
}

module.exports = Contact;
