import React from 'react';
import ReactDOM from 'react-dom';
import Lightbox from './react-images/LightBox';
import {load} from './Loader'

import MediaPreview from './MediaPreview'
import ImageButton from './controls/ImageButton'
import RedditButton from './controls/RedditButton'
import BackToTop from './BackToTop'

/*
  react-photo-gallery
  https://github.com/neptunian/react-photo-gallery
*/

var Gallery = React.createClass({
    propTypes: {
        photos: function(props, propName, componentName) {
            var lightboxImageValidator = React.PropTypes.object;
            if (!props.disableLightbox) {
                lightboxImageValidator = React.PropTypes.object.isRequired;
            }
            return React.PropTypes.arrayOf(React.PropTypes.shape({width: React.PropTypes.number.isRequired, height: React.PropTypes.number.isRequired, aspectRatio: React.PropTypes.number.isRequired, data: React.PropTypes.object.isRequired})).isRequired.apply(this, arguments);
        },
        disableLightbox: React.PropTypes.bool
    },
    contextTypes: {
        store: React.PropTypes.object
    },
    getDefaultProps() {
        return {lightboxShowImageCount: false, backdropClosesModal: true, disableLightbox: false};
    },
    getInitialState() {
        return {currentImage: 0, containerWidth: 0};
    },
    componentDidMount() {
        this.setState({
            containerWidth: Math.floor(ReactDOM.findDOMNode(this).clientWidth)
        })
        window.addEventListener('resize', this.handleResize);
    },
    componentDidUpdate() {
        if (ReactDOM.findDOMNode(this).clientWidth !== this.state.containerWidth) {
            this.setState({
                containerWidth: Math.floor(ReactDOM.findDOMNode(this).clientWidth)
            });
        }
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize, false);
    },
    handleResize(e) {
        this.setState({
            containerWidth: Math.floor(ReactDOM.findDOMNode(this).clientWidth)
        });
    },
    openLightbox(index, event) {
        event.preventDefault();
        this.setState({currentImage: index, lightboxIsOpen: true});
    },
    closeLightbox() {
        this.setState({currentImage: 0, lightboxIsOpen: false});
    },
    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1
        });
    },
    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1
        });

        // handle loading while in lightbox
        if (this.state.currentImage + 4 >= this.props.photos.length) {
            this.context.store.dispatch(load());
        }
    },
    handleDownload() {
        window.open(this.props.photos[this.state.currentImage].direct);
    },
    handleReddit() {
        window.open(this.props.photos[this.state.currentImage].permalink);
    },
    render() {
        var rowLimit,
            photoPreviewNodes = [];

        // if (this.state.containerWidth >= 1250) {
        //     rowLimit = 4;
        // } else

        if (this.state.containerWidth >= 1100) {
            rowLimit = 3;
        } else if (this.state.containerWidth >= 600) {
            rowLimit = 2;
        } else {
            rowLimit = 1;
        }

        var contWidth = this.state.containerWidth - (rowLimit * 4);/* 4px for margin around each image*/
        contWidth = Math.floor(contWidth - 2); // add some padding to prevent layout prob
        var lightboxImages = [];
        for (var i = 0; i < this.props.photos.length; i += rowLimit) {
            var rowItems = [];
            // loop thru each set of rowLimit num
            // eg. if rowLimit is 3 it will  loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
            var aspectRatio = 0,
                totalAr = 0,
                commonHeight = 0;
            for (var j = i; j < i + rowLimit; j++) {
                if (j >= this.props.photos.length) { // add empty square for missing images in row to prevent tall 1 image rows
                    totalAr += 1;
                    continue;
                }
                //console.log(this.props.photos[j], this.props.photos[j].aspectRatio);
                totalAr += this.props.photos[j].aspectRatio;
            }
            commonHeight = contWidth / totalAr;
            // run thru the same set of items again to give the common height
            for (var k = i; k < i + rowLimit; k++) {
                if (k == this.props.photos.length) {
                    break;
                }
                //  var src = this.props.photos[k].src;
                if (this.props.disableLightbox) {
                    photoPreviewNodes.push(
                        <div key={k} className={'element'} style={{width: (commonHeight * this.props.photos[k].aspectRatio) + 'px', height: commonHeight + 'px'}}>
                            <MediaPreview
                                {... this.props.photos[k]}
                                height={commonHeight}
                                width={commonHeight * this.props.photos[k].aspectRatio}
                                style={{
                                  display: 'block',
                                  border: 0
                                }}/>
                        </div>
                    );
                } else {
                    lightboxImages.push(this.props.photos[k]);
                    photoPreviewNodes.push(
                        <div key={k} className={'element'} style={{width: (commonHeight * this.props.photos[k].aspectRatio) + 'px', height: commonHeight + 'px'}}>
                            <a href="#" className={k} onClick={this.openLightbox.bind(this, k)}>
                                <MediaPreview
                                  {... this.props.photos[k]}
                                  height={commonHeight}
                                  width={commonHeight * this.props.photos[k].aspectRatio}
                                  style={{
                                    display: 'block',
                                    border: 0
                                  }}/>
                            </a>
                        </div>
                    );
                }
            }
        }
        return (this.renderGallery(photoPreviewNodes, lightboxImages));
    },
    renderGallery(photoPreviewNodes, lightboxImages) {
        var customControls = [];
        if (this.props.photos.length > 0 && typeof this.props.photos[this.state.currentImage] !== 'undefined') {
            if (typeof this.props.photos[this.state.currentImage].direct === 'string') {
                customControls.push(<ImageButton key="Download" handler={this.handleDownload}/>);
            }
            if (typeof this.props.photos[this.state.currentImage].permalink === 'string') {
                customControls.push(<RedditButton key="Reddit" handler={this.handleReddit}/>);
            }
        }

        if (this.props.disableLightbox) {
            return (
                <div id="Gallery" className="clearfix">
                    {photoPreviewNodes}
                </div>
            );
        } else {
            return (
                <div>
                    <div id="Gallery" className="clearfix">
                        {photoPreviewNodes}
                    </div>
                    <Lightbox currentImage={this.state.currentImage} images={lightboxImages} isOpen={this.state.lightboxIsOpen} onClose={this.closeLightbox} onClickPrev={this.gotoPrevious} onClickNext={this.gotoNext} width={1600} showImageCount={this.props.lightboxShowImageCount} backdropClosesModal={this.props.backdropClosesModal} customControls={customControls}/>
                    <BackToTop show={!this.state.lightboxIsOpen}/>
                </div>
            );
        }
    }
});

export default Gallery;
