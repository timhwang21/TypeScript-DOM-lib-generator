const {message} = require("danger")
const {readFileSync, existsSync} = require("fs")
const parseDiff = require("parse-diff")

const diffPath = "./TypeScript/baseline-changes.diff"
if (existsSync(diffPath)) {
  const diffContents = readFileSync(diffPath, "utf8")
  const diffedFiles = parseDiff(diffContents)
  
  const uninterestingFiles = [".generated.d.ts", "globalThisBlockscopedProperties.types", "mappedTypeRecursiveInference.types"]
  const withoutKnownNormalFails = diffedFiles.filter(diff => {
    return uninterestingFiles.filter(suffix => diff.to?.endsWith(suffix)).length > 0
  })

  const md = ["## Changed baselines from the TypeScript test suite"]

  withoutKnownNormalFails.forEach(diff => {
    md.push(`#### ${diff.to || diff.from}}`)

    md.push("```diff")
    diff.chunks.forEach(chunk => {
      md.push(chunk.content)
    })
    md.push("```")
  })


  message(md.join("\n"))
}