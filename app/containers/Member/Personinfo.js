import React, {Component} from 'react';
import Formlist from './Formlist'

class Personinfo extends Component {
  constructor(props, context) {
    super(props);
  }
  componentWillMount() {}
  render() {
    return (
      <div key={5}>
        <div className="Contentbox">
          <div className="Listhead">
            账号设置
          </div>

          <div className="PersonCont">
            <Formlist/>
          </div>

        </div>
      </div>
    )
  }
}
export default Personinfo
