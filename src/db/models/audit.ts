import mongoose from 'mongoose'

export default mongoose.model(
  'Audit',
  new mongoose.Schema(
    {
      baseUrl: {
        type: String,
        required: true,
        trim: true,
      },
      originalUrl: {
        type: String,
        required: true,
        trim: true,
      },
      method: {
        type: String,
        required: true,
        trim: true,
      },
      path: {
        type: String,
        trim: true,
      },
      reqOrgId: {
        type: String,
        trim: true,
      },
      reqId: {
        type: String,
        trim: true,
      },
      putDiff: {
        type: Object,
      },
      reqBody: {
        type: Object,
      },
      resData: {
        type: Object,
      },
      resMessage: {
        type: String,
      },
      userName: {
        type: String,
      },
      userId: {
        type: String,
      },
      userOrgId: {
        type: String,
      },
      userRole: {
        type: String,
      },
    },
    { timestamps: true }
  )
)
