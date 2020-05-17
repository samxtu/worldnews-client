import React , { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import withSyles from '@material-ui/core/styles/withStyles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Link} from 'react-router-dom';
//Components
import Scream from '../components/Scream';
import Categories from '../components/Categories';
import Countries from '../components/Countries';
import NewsSkeleton from '../components/NewsSkeleton';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// mui stuff
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.REACT_APP_WORLDNEWS_API_KEY);
var networkDataReceived = false;
    
const styles = () => ({
    alert: {
        width: "100%",
        textAlign: "center"
    },
    button: {
      textAlign:'center',
      width:'100%',
      margin:'auto'
    },
    buttonProgress: {
      position: 'relative',
      textAlign:'center',
      width:'100%',
      margin:'auto',
      left:'45%'
    },
  });

class home extends Component {
    constructor(props){
        super(props);
        this.state = {
            moreLoading: false,
            loading: true,
            error: false,
            theError: '',
            news: [],
            page: 1,
            cachePage: 1,
            stateProps: this.props,
            param1Name: 'World',
            param2Name: this.props.match.params.title?this.props.match.params.title:'',
            linkToParam1: '/top-stories'
        }
    }
    
    fetchOnline = () =>{
        return newsapi.v2.topHeadlines({
        language: 'en',
        page: this.state.page
        }).then(response => {
            if(response.status === 'ok'){
                networkDataReceived = true;
                this.setState({
                    loading: false,
                    error: false,
                    page: this.state.page+1,
                    news: response.articles
                })
            } else{
                this.setState({
                    error: true,
                    theError: "Sorry! Problem loading new headlines!"
                })
            }
        })
        .catch((err)=>{
            console.log(err)
            this.setState({
                error: true,
                theError: "Offline: Turn on data for latest headlines."
            })
        });
    }
    fetchCatOnline = (cat) =>{
        return newsapi.v2.topHeadlines({
        language: 'en',
        category: cat,
        page: this.state.page
        }).then(response => {
            if(response.status === 'ok'){
                networkDataReceived = true;
                this.setState({
                    loading: false,
                    error: false,
                    page: this.state.page+1,
                    news: response.articles
                })
            } else{
                this.setState({
                    error: true,
                    theError: "Sorry! Problem loading new headlines!"
                })
            }
        })
        .catch((err)=>{
            console.log(err)
            this.setState({
                error: true,
                theError: "Offline: Turn on data for latest headlines."
            })
        });
    }
    UNSAFE_componentWillMount(){
        this.setState({
            news: [],
            page: 1,
            cachePage: 1,
            stateProps: this.props
        })
        // fetch cached data
        const This = this;
        if(This.props.match.params.title){
            caches.open('mysite-dynamic').then((cache)=>{
                cache.match('https://newsapi.org/v2/top-headlines?language=en&category='+This.props.match.params.title+'&page='+this.state.cachePage,{ignoreMethod:true,ignoreVary:true})
                .then(function(res) {
                    if (!res) throw Error("No data");
                    return res.json();
                }).then(function(response) {
                    console.log(response)
                    // don't overwrite newer network data
                    if (!networkDataReceived) {
                        This.setState({
                            loading: false,
                            cachePage: This.state.cachePage+1,
                            news: response.articles
                        })
                        console.log(This.state.news)
                    }
                }).catch((err)=> {
                    return console.log(err)
                })
            }).catch(err=>{
                console.log(err)
                This.setState({
                    error: true,
                    theError: "Sorry! Problem loading new headlines!"
                })
            })
        } else{
            caches.open('mysite-dynamic').then((cache)=>{
                cache.match('https://newsapi.org/v2/top-headlines?language=en&page='+this.state.cachePage,{ignoreMethod:true,ignoreVary:true})
                .then(function(res) {
                    if (!res) throw Error("No data");
                    return res.json();
                }).then(function(response) {
                    console.log(response)
                    // don't overwrite newer network data
                    if (!networkDataReceived) {
                        This.setState({
                            loading: false,
                            cachePage: This.state.cachePage+1,
                            news: response.articles
                        })
                        console.log(This.state.news)
                    }
                }).catch((err)=> {
                    return console.log(err)
                })
            }).catch(err=>{
                console.log(err)
                This.setState({
                    error: true,
                    theError: "Sorry! Problem loading new headlines!"
                })
            })
        }
    }

    componentDidMount(){
        window.scrollTo(0, 0)
        if(this.state.stateProps.match.params.title) {
            this.setState({
                param1Name: 'World',
                param2Name: this.state.stateProps.match.params.title,
                linkToParam1: '/top-stories'
            })
            return this.fetchCatOnline(this.state.stateProps.match.params.title) }
        else {
            this.setState({
                param2Name: 'World'
            })
            return this.fetchOnline();}
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(this.state.stateProps.match.params.title !== nextProps.match.params.title){
        this.setState({
            loading: true,
            news: [],
            page: 1,
            cachePage: 1,
            stateProps: nextProps
        })
        //do other stuff down here
        if(nextProps.match.params.title) {
            this.setState({
                param1Name: 'World',
                param2Name: nextProps.match.params.title,
                linkToParam1: '/top-stories'
            })
            return this.fetchCatOnline(nextProps.match.params.title) }
        else {
            this.setState({
                param2Name: 'World'
            })
            return this.fetchOnline();}
        } 
    }

    addMoreHeadlines = () =>{
        this.setState({moreLoading: true})
        const This = this;
        if(this.state.stateProps.match.params.title) {
            return newsapi.v2.topHeadlines({
                language: 'en',
                category: this.state.stateProps.match.params.title,
                page: this.state.page
                }).then(response => {
                    if(response.status === 'ok'){
                        networkDataReceived = true;
                        this.setState({
                            moreLoading: false,
                            error: false,
                            page: this.state.page+1,
                            news: this.state.news.concat(response.articles)
                        })
                    } else{
                        this.setState({
                            moreLoading: false,
                            error: true,
                            theError: "Sorry! Problem loading new headlines!"
                        })
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    if(this.state.theError === "Offline: Turn on data for latest headlines."){
                        caches.match('https://newsapi.org/v2/top-headlines?language=en&page='+this.state.cachePage,{ignoreMethod:true,ignoreVary:true})
                        .then(function(res) {
                            if (!res) throw Error("No data");
                            console.log("we got the good stuff")
                            return res.json();
                        }).then(function(response) {
                            console.log(response)
                            // don't overwrite newer network data
                            if (!networkDataReceived) {
                                console.log("the state was set")
                                This.setState({
                                    moreLoading: false,
                                    cachePage: This.state.cachePage+1,
                                    news: This.state.news.concat(response.articles)
                                })
                                console.log(This.state.news)
                            }
                        }).catch(err=> {
                            this.setState({
                                moreLoading: false
                            })
                            return console.log(err)
                        })
                    } else {
                        this.setState({
                            moreLoading: false,
                            error: true,
                            theError: "Sorry! Problem loading new headlines!"
                        })
                    }
                });
        } else {
            return newsapi.v2.topHeadlines({
                language: 'en',
                page: this.state.page
                }).then(response => {
                    if(response.status === 'ok'){
                        networkDataReceived = true;
                        this.setState({
                            moreLoading: false,
                            error: false,
                            page: this.state.page+1,
                            news: this.state.news.concat(response.articles)
                        })
                    } else{
                        this.setState({
                            moreLoading: false,
                            error: true,
                            theError: "Sorry! Problem loading new headlines!"
                        })
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    if(this.state.theError === "Offline: Turn on data for latest headlines."){
                        caches.match('https://newsapi.org/v2/top-headlines?language=en&page='+this.state.cachePage,{ignoreMethod:true,ignoreVary:true})
                        .then(function(res) {
                            if (!res) throw Error("No data");
                            console.log("we got the good stuff")
                            return res.json();
                        }).then(function(response) {
                            console.log(response)
                            // don't overwrite newer network data
                            if (!networkDataReceived) {
                                console.log("the state was set")
                                This.setState({
                                    moreLoading: false,
                                    cachePage: This.state.cachePage+1,
                                    news: This.state.news.concat(response.articles)
                                })
                                console.log(This.state.news)
                            }
                        }).catch(err=> {
                            this.setState({
                                moreLoading: false
                            })
                            return console.log(err)
                        })
                    } else {
                        this.setState({
                            moreLoading: false,
                            error: true,
                            theError: "Sorry! Problem loading new headlines!"
                        })
                    }
                });
        }

    }
    render (){
        const {classes} = this.props;
        const { loading, news, error, theError, moreLoading, param1Name, param2Name, linkToParam1, stateProps } = this.state;
        const headers = [];
        let moreButton = moreLoading?(
            <Fragment>
                <Button
                variant="outlined"
                color="primary"
                disabled={true}
                aria-label='Load more headlines'
                endIcon={<ExpandMoreIcon />}
                className={classes.button}
                >
                Load more headlines
                </Button>
                <CircularProgress color='primary' size={24} className={classes.buttonProgress} />
            </Fragment>
        ):(
            <Button
              variant="outlined"
              aria-label='Load more headlines'
              color="primary"
              endIcon={<ExpandMoreIcon />}
              onClick={this.addMoreHeadlines}
              className={classes.button}
            >
              <b>Load more headlines</b>
            </Button>
            );
        let fetchError = error?(<Alert className={classes.alert} elevation={6} variant="filled" severity="warning">{theError}</Alert>):null;
        let recentScreamMarkUp = !loading?news.map((scream,ind)=>{
            if(scream.title && !headers.includes(scream.title)){
                headers.push(scream.title)
                return (<Scream key={`${scream.title}${ind}`} scream={scream} trending={true} />)
            } else return null
        }):(<NewsSkeleton />)
        return (
            <Grid container spacing={1}>
                {fetchError}
                <Hidden smDown>
                <Grid item md={2}>
                </Grid>
                </Hidden>
                <Grid item md={8} sm={9} xs={12}>
                    {!loading&&(<Fragment><Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className={classes.breadcrumb}>
                        <Typography color="textPrimary" variant='body2'>
                        Top stories:
                        </Typography>
                        {param1Name?<MuiLink color="textPrimary" component={Link} href={linkToParam1} to={linkToParam1}>
                        <Typography variant='body1' color='textPrimary'>{param1Name}</Typography>
                        </MuiLink>:null}
                        <Typography color="textPrimary" variant='body1'>{param2Name}</Typography>
                    </Breadcrumbs>
                    <hr/></Fragment>)}
                    {recentScreamMarkUp}
                    {moreButton}
                </Grid>
                <Hidden xsDown>
                    <Grid  item md={2} sm={3} xs={12}>
                        <Categories category={stateProps.match.params.title?'stateProps.match.params.title':'All'} country='All' urlTo='/top-stories' />
                        <Countries country='All' category={stateProps.match.params.title?'stateProps.match.params.title':'All'}  urlTo='/country' />
                    </Grid>
                </Hidden>
            </Grid>
        )
    }
}

export default withSyles(styles)(home);