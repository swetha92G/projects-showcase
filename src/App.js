import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsList from './components/ProjectsList'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class App extends Component {
  state = {data: [], ap: apStatus.initial, select: 'ALL'}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ap: apStatus.loading})
    const {select} = this.state

    const url = ` https://apis.ccbp.in/ps/projects?category=${select}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(i => ({
        id: i.id,
        name: i.name,
        imageUrl: i.image_url,
      }))
      this.setState({data: updateData, ap: apStatus.success})
    } else {
      this.setState({ap: apStatus.fail})
    }
  }

  one = event => {
    this.setState({select: event.target.value}, this.getData)
  }

  loadingView = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="q-container">
        <ul className="app-container">
          {data.map(each => (
            <ProjectsList details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="image"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="but" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {ap} = this.state
    switch (ap) {
      case apStatus.loading:
        return this.loadingView()
      case apStatus.success:
        return this.successView()
      case apStatus.fail:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {select} = this.state
    return (
      <div>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="web"
            alt="website logo"
          />
        </nav>
        <div className="main-con">
          <ul className="select-con">
            <select className="select" value={select} onChange={this.one}>
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </div>
    )
  }
}

export default App
