import React from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

interface ScenarioWeightingTitleBlockProps {
  operationName: string
}

class ScenarioWeightingTitleBlock extends React.Component<ScenarioWeightingTitleBlockProps, never> {
  render() {
    return (
      <div>
        <Table>
          <tbody>
            <tr>
              <th>Operation Name:</th>
              <td>
                <input type="text" value={this.props.operationName}></input>
              </td>
              <th>Time:</th>
              <td>
                <input type="text"></input>
              </td>
            </tr>
            <tr>
              <th>Prepared by:</th>
              <td>
                <input type="text"></input>
              </td>
              <th>Date:</th>
              <td>
                <input type="text"></input>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

interface ScenarioWeightingScenarioNamesProps {
  scenarios: string[]
  addScenario: () => void
  updateScenarioName: (id: number, value: string) => void
}

class ScenarioWeightingScenarioNames extends React.Component<ScenarioWeightingScenarioNamesProps, never> {
  constructor(props: ScenarioWeightingScenarioNamesProps) {
    super(props)

    this.updateScenarioName = this.updateScenarioName.bind(this)
  }

  updateScenarioName(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const value = target.value
    const id = target.id
    this.props.updateScenarioName(Number(id), value)
  }

  render() {
    const scenarios = []
    for (const scenario in this.props.scenarios) {
      scenarios.push(
        <tr key={scenario}>
          <td>{scenario}</td>
          <td>
            <input type="text" defaultValue={this.props.scenarios[scenario]} onChange={this.updateScenarioName} id={scenario} />
          </td>
        </tr>
      )
    }

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <td>Scenario</td>
              <td>Short Description</td>
            </tr>
          </thead>
          <tbody>
            {scenarios}
            <tr key="new">
              <td colSpan={2}>
                <Button type="button" onClick={this.props.addScenario}>
                  Add Scenario
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

interface ScenarioWeightingWeightingsProps {
  updateRanking: (participant: number, scenario: number, ranking: number) => void
  addParticipant: () => void
  participants: string[]
  scenarios: string[]
  rankings: number[][]
}

class ScenarioWeightingWeightings extends React.Component<ScenarioWeightingWeightingsProps, never> {
  constructor(props: ScenarioWeightingWeightingsProps) {
    super(props)

    this.updateRanking = this.updateRanking.bind(this)
  }

  updateRanking(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const value = target.value
    const id = target.id
    const components = id.split('_')
    this.props.updateRanking(Number(components[0]), Number(components[1]), Number(value))
  }

  render() {
    const rows = []
    const scenarios = []
    const scenarioTotals = []
    const relativeWeights = [<th key="blank">Relative Weights</th>]
    for (const participant in this.props.participants) {
      const data = [<th key={participant}>{participant}</th>]
      for (const scenario in this.props.scenarios) {
        data.push(
          <td key={participant + '_' + scenario}>
            <input type="number" min={0} max={100} id={participant + '_' + scenario} onChange={this.updateRanking} value={this.props.rankings[participant][scenario]} />
          </td>
        )
      }
      rows.push(<tr key={participant}>{data}</tr>)
    }
    let allScenariosTotal = 0
    for (const scenario in this.props.scenarios) {
      scenarios.push(<th key={scenario}>{this.props.scenarios[scenario]}</th>)
      let total = 0
      for (const participant in this.props.participants) {
        total += this.props.rankings[participant][scenario]
      }
      scenarioTotals.push(total)
      allScenariosTotal += total
    }
    for (const scenario in scenarioTotals) {
      relativeWeights.push(<td key={scenario}>{Math.trunc((scenarioTotals[scenario] / allScenariosTotal) * 100)}%</td>)
    }
    return (
      <Table bordered hover>
        <thead>
          <tr>
            <th key="label">Participant</th>
            {scenarios}
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr key="new">
            <td>
              <Button type="button" onClick={this.props.addParticipant}>
                Add Participant
              </Button>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>{relativeWeights}</tr>
        </thead>
      </Table>
    )
  }
}

interface ScenarioWeightingWorksheetState {
  operationName: string
  scenarios: string[]
  participants: string[]
  rankings: number[][]
}

export class ScenarioWeightingWorksheet extends React.Component<object, ScenarioWeightingWorksheetState> {
  constructor(props: object) {
    super(props)

    this.state = {
      operationName: '',
      scenarios: [],
      participants: [],
      rankings: []
    }

    this.addScenario = this.addScenario.bind(this)
    this.updateScenarioName = this.updateScenarioName.bind(this)
    this.addParticipant = this.addParticipant.bind(this)
    this.updateRanking = this.updateRanking.bind(this)
  }

  addScenario() {
    this.setState(function (oldState) {
      oldState.scenarios.push('')
      for (const participant in oldState.participants) {
        oldState.rankings[participant].push(0)
      }
      return oldState
    })
  }

  addParticipant() {
    this.setState(function (oldState) {
      oldState.participants.push('')
      const rankings = oldState.scenarios.map(() => 0)
      oldState.rankings.push(rankings)
      return oldState
    })
  }

  updateScenarioName(scenarioId: number, name: string) {
    this.setState(function (oldState) {
      oldState.scenarios[scenarioId] = name
      return oldState
    })
  }

  updateRanking(participant: number, scenario: number, ranking: number) {
    this.setState(function (oldState) {
      oldState.rankings[participant][scenario] = ranking
      return oldState
    })
  }

  render() {
    return (
      <div>
        <ScenarioWeightingTitleBlock operationName={this.state.operationName} />
        <ScenarioWeightingScenarioNames scenarios={this.state.scenarios} addScenario={this.addScenario} updateScenarioName={this.updateScenarioName} />
        <ScenarioWeightingWeightings
          scenarios={this.state.scenarios}
          participants={this.state.participants}
          addParticipant={this.addParticipant}
          rankings={this.state.rankings}
          updateRanking={this.updateRanking}
        />
      </div>
    )
  }
}
