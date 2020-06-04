import * as React from "react";
import logoWikilist from "../../../../shared/img/wikilist-logo.png";
import {Header} from "./header";
import {GlobalContextProps} from "../../context/global-context";
import {Grid, Icon, Segment} from "semantic-ui-react";

export const WIKILIST_URL = "https://github.com/atelier-des-communs/wiki-lists";

export const Footer = (props:GlobalContextProps) => {

    let _ = props.messages;

    return <Segment inverted vertical style={{padding: "2rem", marginTop: "3em"}}>

        <Grid stackable columns={4}>

            <Grid.Column style={{textAlign:"center"}}>
                <a href="/about">à propos / mentions légales</a>
            </Grid.Column>

            <Grid.Column style={{textAlign:"center"}}>
                <a href="https://twitter.com/VigiBati"><Icon name="twitter" /> Twitter </a>
            </Grid.Column>

            <Grid.Column style={{textAlign:"center"}}>
                développé par <a href="https://atelier-des-communs.fr/">l'Atelier des communs {<Icon name="globe" />}</a>
            </Grid.Column>

            <Grid.Column style={{textAlign:"center"}}>
                {_.powered_by}
                <a href={WIKILIST_URL} >
                    <img
                        src={logoWikilist}
                        width="100"
                        style={{cursor: 'pointer', verticalAlign: "middle"}} />
                </a>
            </Grid.Column>
        </Grid>

    </Segment>
}

export class MainLayout extends React.Component<GlobalContextProps> {

    constructor(props: GlobalContextProps) {
        super(props);
    }

    goTo(url:string) {
        window.location.href = url;
    }

    render() {

        let props = this.props;
        let _ = props.messages;

        let pointerCursor = {cursor: 'pointer'};

        return <>
            <Header {...props}>

                <div style={{textAlign: "center"}}>
                    <img
                        src={logoWikilist}
                        width="300"
                        style={pointerCursor}
                        onClick={() => this.goTo("/")}/>
                    <br/>
                    <span
                        onClick={() => this.goTo("/")}
                        style={{...pointerCursor, fontSize: "large"}}>
                    {_.site_title}</span>
                </div>

            </Header>

            {props.children}

            <Footer {...props} />

        </>
    }
}