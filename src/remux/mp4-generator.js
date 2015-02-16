/**
 * generate MP4 Box
 */

class MP4 {
  static init() {
    MP4.types = {
      avc1: [], // codingname
      avcC: [],
      btrt: [],
      dinf: [],
      dref: [],
      esds: [],
      ftyp: [],
      hdlr: [],
      mdat: [],
      mdhd: [],
      mdia: [],
      mfhd: [],
      minf: [],
      moof: [],
      moov: [],
      mp4a: [],
      mvex: [],
      mvhd: [],
      sdtp: [],
      stbl: [],
      stco: [],
      stsc: [],
      stsd: [],
      stsz: [],
      stts: [],
      tfdt: [],
      tfhd: [],
      traf: [],
      trak: [],
      trun: [],
      trex: [],
      tkhd: [],
      vmhd: []
    };

    var i;
    for (i in MP4.types) {
      if (MP4.types.hasOwnProperty(i)) {
        MP4.types[i] = [
          i.charCodeAt(0),
          i.charCodeAt(1),
          i.charCodeAt(2),
          i.charCodeAt(3)
        ];
      }
    }

    MP4.MAJOR_BRAND = new Uint8Array([
      'i'.charCodeAt(0),
      's'.charCodeAt(0),
      'o'.charCodeAt(0),
      'm'.charCodeAt(0)
    ]);
    MP4.AVC1_BRAND = new Uint8Array([
      'a'.charCodeAt(0),
      'v'.charCodeAt(0),
      'c'.charCodeAt(0),
      '1'.charCodeAt(0)
    ]);
    MP4.MINOR_VERSION = new Uint8Array([0, 0, 0, 1]);
    MP4.VIDEO_HDLR = new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      0x56, 0x69, 0x64, 0x65,
      0x6f, 0x48, 0x61, 0x6e,
      0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
    ]);
    MP4.AUDIO_HDLR = new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      0x53, 0x6f, 0x75, 0x6e,
      0x64, 0x48, 0x61, 0x6e,
      0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
    ]);
    MP4.HDLR_TYPES = {
      'video':MP4.VIDEO_HDLR,
      'audio':MP4.AUDIO_HDLR
    };
    MP4.DREF = new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x01, // entry_count
      0x00, 0x00, 0x00, 0x0c, // entry_size
      0x75, 0x72, 0x6c, 0x20, // 'url' type
      0x00, // version 0
      0x00, 0x00, 0x01 // entry_flags
    ]);
    MP4.STCO = new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00 // entry_count
    ]);
    MP4.STSC = MP4.STCO;
    MP4.STSZ = new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // sample_size
      0x00, 0x00, 0x00, 0x00, // sample_count
    ]);
    MP4.STTS = MP4.STCO;
    MP4.VMHD = new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x01, // flags
      0x00, 0x00, // graphicsmode
      0x00, 0x00,
      0x00, 0x00,
      0x00, 0x00 // opcolor
    ]);
    MP4.SMHD = new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, // balance
      0x00, 0x00 // reserved
    ]);

    MP4.STSD = new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x01]);// entry_count

    MP4.MEDIAHEADER_TYPES = {
      'video': MP4.VMHD,
      'audio': MP4.SMHD
    };

    MP4.FTYP = MP4.box(MP4.types.ftyp, MP4.MAJOR_BRAND, MP4.MINOR_VERSION, MP4.MAJOR_BRAND, MP4.AVC1_BRAND);
    MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, MP4.DREF));
  }

  static box(type) {
  var
    payload = Array.prototype.slice.call(arguments, 1),
    size = 0,
    i = payload.length,
    result,
    view;

    // calculate the total size we need to allocate
    while (i--) {
      size += payload[i].byteLength;
    }
    result = new Uint8Array(size + 8);
    view = new DataView(result.buffer);
    view.setUint32(0, result.byteLength);
    result.set(type, 4);

    // copy the payload into the result
    for (i = 0, size = 8; i < payload.length; i++) {
      result.set(payload[i], size);
      size += payload[i].byteLength;
    }
    return result;
  }

  static hdlr(type) {
    return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
  }

  static mdat(data) {
    return MP4.box(MP4.types.mdat, data);
  }

  static mdhd(duration) {
    return MP4.box(MP4.types.mdhd, new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x02, // creation_time
      0x00, 0x00, 0x00, 0x03, // modification_time
      0x00, 0x01, 0x5f, 0x90, // timescale, 90,000 "ticks" per second

      (duration & 0xFF000000) >> 24,
      (duration & 0xFF0000) >> 16,
      (duration & 0xFF00) >> 8,
      duration & 0xFF, // duration
      0x55, 0xc4, // 'und' language (undetermined)
      0x00, 0x00
    ]));
  }

  static mdia(track) {
    return MP4.box(MP4.types.mdia, MP4.mdhd(track.duration), MP4.hdlr(track.type), MP4.minf(track));
  }

  static mfhd(sequenceNumber) {
    return MP4.box(MP4.types.mfhd, new Uint8Array([
      0x00,
      0x00, 0x00, 0x00, // flags
      (sequenceNumber & 0xFF000000) >> 24,
      (sequenceNumber & 0xFF0000) >> 16,
      (sequenceNumber & 0xFF00) >> 8,
      sequenceNumber & 0xFF, // sequence_number
    ]));
  }

  static minf(track) {
    return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.MEDIAHEADER_TYPES[track.type]), MP4.DINF, MP4.stbl(track));
  }

  static moof(sn, baseMediaDecodeTime, track) {
    return MP4.box(MP4.types.moof,
                   MP4.mfhd(sn),
                   MP4.traf(track,baseMediaDecodeTime));
  }
/**
 * @param tracks... (optional) {array} the tracks associated with this movie
 */
  static moov(tracks) {
    var
      i = tracks.length,
      boxes = [];

    while (i--) {
      boxes[i] = MP4.trak(tracks[i]);
    }

    return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(tracks[0].duration)].concat(boxes).concat(MP4.mvex(tracks)));
  }

  static mvex(tracks) {
    var
      i = tracks.length,
      boxes = [];

    while (i--) {
      boxes[i] = MP4.trex(tracks[i]);
    }
    return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
  }

  static mvhd(duration) {
    var
      bytes = new Uint8Array([
        0x00, // version 0
        0x00, 0x00, 0x00, // flags
        0x00, 0x00, 0x00, 0x01, // creation_time
        0x00, 0x00, 0x00, 0x02, // modification_time
        0x00, 0x01, 0x5f, 0x90, // timescale, 90,000 "ticks" per second
        (duration & 0xFF000000) >> 24,
        (duration & 0xFF0000) >> 16,
        (duration & 0xFF00) >> 8,
        duration & 0xFF, // duration
        0x00, 0x01, 0x00, 0x00, // 1.0 rate
        0x01, 0x00, // 1.0 volume
        0x00, 0x00, // reserved
        0x00, 0x00, 0x00, 0x00, // reserved
        0x00, 0x00, 0x00, 0x00, // reserved
        0x00, 0x01, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x01, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, // pre_defined
        0xff, 0xff, 0xff, 0xff // next_track_ID
      ]);
    return MP4.box(MP4.types.mvhd, bytes);
  }

  static sdtp(track) {
    var
      samples = track.samples || [],
      bytes = new Uint8Array(4 + samples.length),
      sample,
      i;

    // leave the full box header (4 bytes) all zero

    // write the sample table
    for (i = 0; i < samples.length; i++) {
      sample = samples[i];
      bytes[i + 4] = (sample.flags.dependsOn << 4) |
        (sample.flags.isDependedOn << 2) |
        (sample.flags.hasRedundancy);
    }

    return MP4.box(MP4.types.sdtp,
               bytes);
  }

  static stbl(track) {
    return MP4.box(MP4.types.stbl,
               MP4.stsd(track),
               MP4.box(MP4.types.stts, MP4.STTS),
               MP4.box(MP4.types.stsc, MP4.STSC),
               MP4.box(MP4.types.stsz, MP4.STSZ),
               MP4.box(MP4.types.stco, MP4.STCO));
  }

  static avc1(track) {
    var sps = [], pps = [], i;
    // assemble the SPSs
    for (i = 0; i < track.sps.length; i++) {
      sps.push((track.sps[i].byteLength & 0xFF00) >>> 8);
      sps.push((track.sps[i].byteLength & 0xFF)); // sequenceParameterSetLength
      sps = sps.concat(Array.prototype.slice.call(track.sps[i])); // SPS
    }

    // assemble the PPSs
    for (i = 0; i < track.pps.length; i++) {
      pps.push((track.pps[i].byteLength & 0xFF00) >>> 8);
      pps.push((track.pps[i].byteLength & 0xFF));
      pps = pps.concat(Array.prototype.slice.call(track.pps[i]));
    }

    return MP4.box(MP4.types.avc1, new Uint8Array([
        0x00, 0x00, 0x00, // reserved
        0x00, 0x00, 0x00, // reserved
        0x00, 0x01, // data_reference_index
        0x00, 0x00, // pre_defined
        0x00, 0x00, // reserved
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, // pre_defined
        (track.width & 0xff00) >> 8,
        track.width & 0xff, // width
        (track.height & 0xff00) >> 8,
        track.height & 0xff, // height
        0x00, 0x48, 0x00, 0x00, // horizresolution
        0x00, 0x48, 0x00, 0x00, // vertresolution
        0x00, 0x00, 0x00, 0x00, // reserved
        0x00, 0x01, // frame_count
        0x13,
        0x76, 0x69, 0x64, 0x65,
        0x6f, 0x6a, 0x73, 0x2d,
        0x63, 0x6f, 0x6e, 0x74,
        0x72, 0x69, 0x62, 0x2d,
        0x68, 0x6c, 0x73, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, // compressorname
        0x00, 0x18, // depth = 24
        0x11, 0x11]), // pre_defined = -1
          MP4.box(MP4.types.avcC, new Uint8Array([
            0x01, // configurationVersion
            track.profileIdc, // AVCProfileIndication
            track.profileCompatibility, // profile_compatibility
            track.levelIdc, // AVCLevelIndication
            0xff // lengthSizeMinusOne, hard-coded to 4 bytes
          ].concat([
            track.sps.length // numOfSequenceParameterSets
          ]).concat(sps).concat([
            track.pps.length // numOfPictureParameterSets
          ]).concat(pps))), // "PPS"
          MP4.box(MP4.types.btrt, new Uint8Array([
            0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
            0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
            0x00, 0x2d, 0xc6, 0xc0])) // avgBitrate
          );
  }

  static esds(track) {
    return new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags

      0x03, // descriptor_type
      0x19, // length
      0x00, 0x01, //es_id
      0x00, // stream_priority

      0x04, // descriptor_type
      0x11, // length
      0x40, //codec : mpeg4_audio
      0x15, // stream_type
      0x00, 0x00, 0x00, // buffer_size
      0x00, 0x00, 0x00, 0x00, // maxBitrate
      0x00, 0x00, 0x00, 0x00, // avgBitrate

      0x05, // descriptor_type
      0x02, // length
      track.config[0],track.config[1]
    ]);
  }

  static mp4a(track) {
        return MP4.box(MP4.types.mp4a, new Uint8Array([
        0x00, 0x00, 0x00, // reserved
        0x00, 0x00, 0x00, // reserved
        0x00, 0x01, // data_reference_index
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, // reserved
        0x00, 0x02, // channelcount:2 channels
        0x00, 0x10, // sampleSize:16bits
        0x00, 0x00, 0x00, 0x00, // reserved2
        (track.audiosamplerate & 0xff00) >> 8,
        track.audiosamplerate & 0xff, //
        0x00, 0x00]),
        MP4.box(MP4.types.esds, MP4.esds(track)));
  }

  static stsd(track) {
    if (track.type === 'audio') {
      return MP4.box(MP4.types.stsd, MP4.STSD , MP4.mp4a(track));
    } else {
      return MP4.box(MP4.types.stsd, MP4.STSD , MP4.avc1(track));
    }
  }

  static tkhd(track) {
    return MP4.box(MP4.types.tkhd, new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x07, // flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      (track.id & 0xFF000000) >> 24,
      (track.id & 0xFF0000) >> 16,
      (track.id & 0xFF00) >> 8,
      track.id & 0xFF, // track_ID
      0x00, 0x00, 0x00, 0x00, // reserved
      (track.duration & 0xFF000000) >> 24,
      (track.duration & 0xFF0000) >> 16,
      (track.duration & 0xFF00) >> 8,
      track.duration & 0xFF, // duration
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, // layer
      0x00, 0x00, // alternate_group
      0x00, 0x00, // non-audio track volume
      0x00, 0x00, // reserved
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
      (track.width & 0xFF00) >> 8,
      track.width & 0xFF,
      0x00, 0x00, // width
      (track.height & 0xFF00) >> 8,
      track.height & 0xFF,
      0x00, 0x00 // height
    ]));
  }

  static traf(track,baseMediaDecodeTime) {
    var sampleDependencyTable = MP4.sdtp(track);
    return MP4.box(MP4.types.traf,
               MP4.box(MP4.types.tfhd, new Uint8Array([
                 0x00, // version 0
                 0x00, 0x00, 0x00, // flags
                 (track.id & 0xFF000000) >> 24,
                 (track.id & 0xFF0000) >> 16,
                 (track.id & 0xFF00) >> 8,
                 (track.id & 0xFF) // track_ID
               ])),
               MP4.box(MP4.types.tfdt, new Uint8Array([
                 0x00, // version 0
                 0x00, 0x00, 0x00, // flags
                 (baseMediaDecodeTime & 0xFF000000) >> 24,
                 (baseMediaDecodeTime & 0xFF0000) >> 16,
                 (baseMediaDecodeTime & 0xFF00) >> 8,
                 (baseMediaDecodeTime & 0xFF) // baseMediaDecodeTime
               ])),
               MP4.trun(track,
                    sampleDependencyTable.length +
                    16 + // tfhd
                    16 + // tfdt
                    8 +  // traf header
                    16 + // mfhd
                    8 +  // moof header
                    8),  // mdat header
               sampleDependencyTable);
  }

  /**
   * Generate a track box.
   * @param track {object} a track definition
   * @return {Uint8Array} the track box
   */
  static trak(track) {
    track.duration = track.duration || 0xffffffff;
    return MP4.box(MP4.types.trak,
               MP4.tkhd(track),
               MP4.mdia(track));
  }

  static trex(track) {
    return MP4.box(MP4.types.trex, new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      (track.id & 0xFF000000) >> 24,
      (track.id & 0xFF0000) >> 16,
      (track.id & 0xFF00) >> 8,
      (track.id & 0xFF), // track_ID
      0x00, 0x00, 0x00, 0x01, // default_sample_description_index
      0x00, 0x00, 0x00, 0x00, // default_sample_duration
      0x00, 0x00, 0x00, 0x00, // default_sample_size
      0x00, 0x01, 0x00, 0x01 // default_sample_flags
    ]));
  }

  static trun(track, offset) {
    var bytes, samples, sample, i;

    samples = track.samples || [];
    offset += 8 + 12 + (16 * samples.length);

    bytes = [
      0x00, // version 0
      0x00, 0x0f, 0x01, // flags
      (samples.length & 0xFF000000) >>> 24,
      (samples.length & 0xFF0000) >>> 16,
      (samples.length & 0xFF00) >>> 8,
      samples.length & 0xFF, // sample_count
      (offset & 0xFF000000) >>> 24,
      (offset & 0xFF0000) >>> 16,
      (offset & 0xFF00) >>> 8,
      offset & 0xFF // data_offset
    ];

    for (i = 0; i < samples.length; i++) {
      sample = samples[i];
      bytes = bytes.concat([
        (sample.duration & 0xFF000000) >>> 24,
        (sample.duration & 0xFF0000) >>> 16,
        (sample.duration & 0xFF00) >>> 8,
        sample.duration & 0xFF, // sample_duration
        (sample.size & 0xFF000000) >>> 24,
        (sample.size & 0xFF0000) >>> 16,
        (sample.size & 0xFF00) >>> 8,
        sample.size & 0xFF, // sample_size
        (sample.flags.isLeading << 2) | sample.flags.dependsOn,
        (sample.flags.isDependedOn << 6) |
          (sample.flags.hasRedundancy << 4) |
          (sample.flags.paddingValue << 1) |
          sample.flags.isNonSyncSample,
        sample.flags.degradationPriority & 0xF0 << 8,
        sample.flags.degradationPriority & 0x0F, // sample_flags
        (sample.compositionTimeOffset & 0xFF000000) >>> 24,
        (sample.compositionTimeOffset & 0xFF0000) >>> 16,
        (sample.compositionTimeOffset & 0xFF00) >>> 8,
        sample.compositionTimeOffset & 0xFF // sample_composition_time_offset
      ]);
    }
    return MP4.box(MP4.types.trun, new Uint8Array(bytes));
  }

  static initSegment(tracks) {

    if(!MP4.types) {
      MP4.init();
    }
    var
      movie = MP4.moov(tracks),
      result;

    result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
    result.set(MP4.FTYP);
    result.set(movie, MP4.FTYP.byteLength);
    return result;
  }
}

export default MP4;


