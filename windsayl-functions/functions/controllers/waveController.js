const firebase = require('firebase')
const admin = require('firebase-admin')
const db = admin.firestore()

const { catchErrors } = require('../util/errors')

exports.getWaves = catchErrors(
  async (req, res) => {
    const waves = []
    const data = await db
      .collection('waves')
      .orderBy('createdAt', 'desc')
      .get()
    data.forEach(doc =>
      waves.push({
        id: doc.id,
        body: doc.data().body,
        handle: doc.data().handle,
        createdAt: doc.data().createdAt
      })
    )
    return res.json(waves)
  },
  (err, req, res) => {
    console.error(err)
    return res
      .status(500)
      .json({ error: `(${err.code || '❌'}) Could not get waves` })
  }
)

exports.getWave = catchErrors(
  async (req, res) => {
    const { waveId } = req.params
    const doc = await db.doc(`/waves/${waveId}`).get()
    if (!doc.exists) {
      return res.status(404).json({ error: `Wave ${waveId} not found.` })
    }
    const waveData = doc.data()
    const commentDocs = await db
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .where('waveId', '==', waveId)
      .get()
    waveData.waveId = waveId
    waveData.comments = []
    commentDocs.forEach(doc => waveData.comments.push(doc.data()))
    return res.json(waveData)
  },
  (err, req, res) => {
    console.error(err)
    return res
      .status(500)
      .json({ error: `(${err.code || '❌'}) Could not get wave` })
  }
)

exports.createWave = catchErrors(
  async (req, res) => {
    const newWave = {
      body: req.body.body,
      handle: req.user.handle,
      createdAt: new Date().toISOString()
    }
    const { id } = await db.collection('waves').add(newWave)
    res.json({ message: `Wave (ID: ${id}) was successfully created` })
  },
  (err, req, res) => {
    console.error(err)
    return res
      .status(500)
      .json({ error: `(${err.code || '❌'}) Could not create new wave` })
  }
)
