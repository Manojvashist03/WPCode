const { registerBlockType } = wp.blocks;
const { Component } = wp.element;
const { RichText, InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, ColorPicker, Toolbar, IconButton } = wp.components;

class FirstBlockEdit extends Component {

    render() {
        const { attributes, setAttributes } = this.props;

        const alignmentClass = (attributes.textAlignment != null) ? 'has-text-align-' + attributes.textAlignment : '';

        return (
            <div className={alignmentClass}>
                <InspectorControls>
                    <PanelBody
                        title="Most awesome settings ever"
                        initialOpen={true}
                    >
                        <PanelRow>
                            <ToggleControl
                                label="Toggle me"
                                checked={attributes.toggle}
                                onChange={(newval) => setAttributes({ toggle: newval })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label="What's your favorite animal?"
                                value={attributes.favoriteAnimal}
                                options={[
                                    {label: "Dogs", value: 'dogs'},
                                    {label: "Cats", value: 'cats'},
                                    {label: "Something else", value: 'weird_one'},
                                ]}
                                onChange={(newval) => setAttributes({ favoriteAnimal: newval })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <ColorPicker
                                color={attributes.favoriteColor}
                                onChangeComplete={(newval) => setAttributes({ favoriteColor: newval.hex })}
                                disableAlpha
                            />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label="Activate lasers?"
                                checked={attributes.activateLasers}
                                onChange={(newval) => setAttributes({ activateLasers: newval })}
                            />
                        </PanelRow>
                    </PanelBody>
                </InspectorControls>
                <BlockControls>
                    <AlignmentToolbar
                        value={attributes.textAlignment}
                        onChange={(newalign) => setAttributes({ textAlignment: newalign })}
                    />
                    <Toolbar>
                        <IconButton
                            label="My very own custom button"
                            icon="edit"
                            className="my-custom-button"
                            onClick={() => console.log('pressed button')}
                        />
                    </Toolbar>
                </BlockControls>
                <RichText
                    tagName="h2"
                    placeholder="Write your heading here"
                    value={attributes.myRichHeading}
                    onChange={(newtext) => setAttributes({ myRichHeading: newtext })}
                />
                <RichText
                    tagName="p"
                    placeholder="Write your paragraph here"
                    value={attributes.myRichText}
                    onChange={(newtext) => setAttributes({ myRichText: newtext })}
                />
            </div>
        );
    }
}

registerBlockType('gtcbs-blocks/custom-block', {
  title: 'Custom Block',
    icon: 'smiley',
    category: 'common',
    description: 'Learning in progress',
    keywords: ['example', 'test'],
    attributes: {
        myRichHeading: {
            type: 'string',
        },
        myRichText: {
            type: 'string',
            source: 'html',
            selector: 'p'
        },
        textAlignment: {
            type: 'string',
        },
        toggle: {
            type: 'boolean',
            default: true
        },
        favoriteAnimal: {
            type: 'string',
            default: 'dogs'
        },
        favoriteColor: {
            type: 'string',
            default: '#DDDDDD'
        },
        activateLasers: {
            type: 'boolean',
            default: false
        },
    },
    supports: {
        align: ['wide', 'full']
    },
    edit: FirstBlockEdit,
    save: (props) => {
        const { attributes } = props;

        const alignmentClass = (attributes.textAlignment != null) ? 'has-text-align-' + attributes.textAlignment : '';

        return (
            <div className={alignmentClass}>
                <RichText.Content
                    tagName="h2"
                    value={attributes.myRichHeading}
                />
                <RichText.Content
                    tagName="p"
                    value={attributes.myRichText}
                />
                {attributes.activateLasers &&
                    <div className="lasers">Lasers activated</div>
                }
            </div>
        );
    }
});