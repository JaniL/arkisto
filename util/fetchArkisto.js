const $ = require('cheerio')
const axios = require('axios')
const R = require('ramda')

const downloadableFormats = [
  'txt',
  'html',
  'pdf',
  'jpg',
  'png',
  'ods'
]

const arkisto = axios.create({
  // baseURL: 'https://arkisto.tko-aly.fi'
})

const isFile = R.pipe(R.split('.'), R.length, R.gte(2))
const isDownloadable = R.pipe(R.split('.'), R.last, R.contains(R._, downloadableFormats))

const processPage = (res) => $.load(res.body).find('a').map(a => a.href)
const decide = href => isDownloadable(href) ? null : processPage()

const start = (startPath = 'https://arkisto.tko-aly.fi/dir/') => {
  arkisto.get(startPath).then(processPage)
}