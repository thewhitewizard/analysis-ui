import dynamic from 'next/dynamic'
import {loadBundle} from 'lib/actions'
import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {loadModification} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import MapLayout from 'lib/layouts/map'
import withInitialFetch from 'lib/with-initial-fetch'

// Lots of the ModificationEditor code depends on Leaflet. Load it all client side
const ModificationEditor = dynamic(
  () => import('lib/containers/modification-editor'),
  {ssr: false}
)

const EditorPage = withInitialFetch(
  ModificationEditor,
  async (dispatch, query) => {
    const {modificationId, projectId} = query

    // TODO check if project and feed are already loaded
    const [project, modification] = await Promise.all([
      dispatch(loadProject(projectId)),
      // Always reload the modification to get recent changes
      dispatch(loadModification(modificationId))
    ])

    // Only gets unloaded feeds for modifications that have them
    const [bundle, feeds] = await Promise.all([
      dispatch(loadBundle(project.bundleId)),
      dispatch(
        getFeedsRoutesAndStops({
          bundleId: project.bundleId,
          modifications: [modification]
        })
      )
    ])

    return {
      bundle,
      feeds,
      modification,
      project
    }
  }
)

EditorPage.Layout = MapLayout

export default EditorPage
