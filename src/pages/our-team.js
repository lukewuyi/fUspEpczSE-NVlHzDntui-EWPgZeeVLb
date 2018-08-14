import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import ArticlePreview from '../components/article-preview'
import styled from 'styled-components';

class OurTeamIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDepartment: 'all',
        };
    }
    
    setDepartment = (e) => {
        console.log('event', e.target.id);
        const {id} = e.target;
        this.setState((prevState) => ({selectedDepartment: id}));
    };

    getMembersFromDepartment(departmentId, departments, members) {

    }

  render() {
    const { selectedDepartment } = this.state;
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const departments = get(this, 'props.data.allContentfulDepartment.edges')
    const teamMembers = get(this, 'props.data.allContentfulTeamMember.edges')
    console.log('teamMembers', teamMembers);  

    return (
      <PageContainer>
        <Helmet title={siteTitle}/>
        <div className='header'>Our Team</div>
        <div className='wrapper'>
            <div className="wrapper">
            <div className="buttonContainer">
                <div id="all" onClick={this.setDepartment} className={`button ${selectedDepartment === 'all' ? 'active' : ''}`}>All</div>
                    {departments.map(department => {
                        const { departmentName, id } = department.node;
                        return (
                            <div key={id}
                            role="button"
                            id={id}
                            className={`button ${selectedDepartment === id ? 'active' : ''}`}
                            onClick={this.setDepartment}>{departmentName}</div>
                        )
                    })}
                </div>
            </div>
            <div className="memberContainer">
                {departments.map(department => {
                    const { departmentName, id } = department.node;
                    const members = teamMembers.filter(member => member.node.department.id === id);
                    const memberHtml = [];
                    
                    if(members.length === 0) return null;

                    members.map(member => {
                        const { fullName, role } = member.node;
                        memberHtml.push(
                        <div key={fullName} className="member">
                         <div className="name">{fullName}</div>
                         <div className="role">{role}</div>
                        </div>
                        );
                    })
                   
                    return (
                        <div key={id}
                        className={`departmentContainer ${selectedDepartment !== 'all' && selectedDepartment !== id ? 'hide' : ''}`}>
                            <div className="subTitle">{departmentName}</div>
                            <div className="departmentMembers">{memberHtml}</div>
                        </div>
                    );
                })}
            </div>
        </div>
      </PageContainer>
    )
  }
}

export default OurTeamIndex

const PageContainer = styled.div`
& .departmentContainer {
    text-align: center;
}
& .hide { display: none; }
& .subTitle {
    padding: 1.5em;
    background-color: rgba(0,0,0,.5);
    color: #fff;
    font-size: 1.5rem;
}
& .role {
    font-size: 0.8rem;
    color: rgba(0,0,0, .5);
}
& .departmentMembers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
& .departmentMembers > * {
    padding: 1.5em;
}
& .buttonContainer {
    max-width: 700px;
    align-self: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
& .buttonContainer > * {
    padding: 1.5em;
}
& .button {
    cursor: pointer;
}
& .button.active {
    border-bottom: 2px solid blue;
}
& .button:hover {
    filter: brightness(200%);
}
& .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 350px;
    background-color: rgba(0,0,0, .5);
    font-size: 1.5rem;
    color: #fff;
}
`;

export const pageQuery = graphql`
query OurTeamIndexQuery {
    allContentfulDepartment(sort: { fields: [order], order: ASC }) {
        edges {
          node {
            id,
            departmentName,
            order
          }
        }
      }
  allContentfulTeamMember {
    edges {
      node {
        id,
        fullName,
        role,
        department{
          id
        }
      }
    }
  }
}
`
  